import React, { useState } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { WizardScreen } from "@/components/layout/wizard-screen";
import { BottomNav } from "@/components/layout/bottom-nav";
import {
  getNextWizardStep,
  getPreviousWizardStep,
  getWizardRoute,
} from "@/utils/wizard";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { ImagePickerField } from "@/components/ui/image-picker-field";
import {
  Folder,
  Code2,
  Plus,
  Trash2,
  Link as LinkIcon,
} from "lucide-react-native";
import { usePortfolioStore } from "@/store";
import { useTranslation } from "react-i18next";
import { Project } from "@/domain/portfolio/types";
import { GitHubImportModal } from "@/components/github/GitHubImportModal";
import { GitHubProcessingModal } from "@/components/github/GitHubProcessingModal";
import {
  GitHubRepositorySummary,
  GitHubRepoDetails,
} from "@/services/github/github.schemas";
import { convertToProject } from "@/services/github/github-adapter";
import { getIncompleteProjects } from "@/domain/portfolio/validation";

export default function ProjectsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { session, addProject, updateProject, removeProject, aggregateSkills } =
    usePortfolioStore();
  const projects = session.projects;

  const [isImportModalVisible, setIsImportModalVisible] = React.useState(false);
  const [isProcessingModalVisible, setIsProcessingModalVisible] =
    React.useState(false);
  const [reposToProcess, setReposToProcess] = React.useState<
    GitHubRepositorySummary[]
  >([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleNext = () => {
    const selectedProjects = projects.filter((p) => p.selected);
    if (selectedProjects.length === 0) {
      setErrorMsg("Adicione pelo menos um projeto.");
      return;
    }

    const incompleteIds = getIncompleteProjects(session);
    if (incompleteIds.length > 0) {
      setErrorMsg(
        "Alguns projetos precisam de título ou descrição. Preencha os campos ou remova-os.",
      );
      return;
    }

    setErrorMsg(null);
    if (returnTo === "editor") {
      router.push("/(wizard)/editor");
    } else {
      router.push(getWizardRoute(getNextWizardStep("projects")!));
    }
  };

  const handleBack = () => {
    if (returnTo === "editor") {
      router.push("/(wizard)/editor");
    } else {
      router.push(getWizardRoute(getPreviousWizardStep("projects")!));
    }
  };

  const handleAddManual = () => {
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      title: "New Project",
      description: "",
      shortDescription: "",
      source: { type: "manual" },
      links: {},
      technologies: [],
      selected: true,
      featured: false,
      order: projects.length,
    };
    addProject(newProject);
  };

  const handleStartImport = (repos: GitHubRepositorySummary[]) => {
    setIsImportModalVisible(false);
    setReposToProcess(repos);
    setIsProcessingModalVisible(true);
  };

  const handleFinishProcessing = (details: GitHubRepoDetails[]) => {
    setIsProcessingModalVisible(false);

    const startOrder = projects.length;
    details.forEach((detail, index) => {
      const newProject = convertToProject(detail, projects, startOrder + index);
      addProject(newProject);
    });

    aggregateSkills();
  };

  return (
    <>
      <WizardScreen
        step={2}
        title={t("projects.title")}
        subtitle={t("projects.subtitle")}
        bottomNav={<BottomNav onNext={handleNext} onBack={handleBack} nextLabel={returnTo === "editor" ? "Salvar e Voltar" : "Continuar"} />}
      >
        <View className="flex-row gap-4 mb-10">
            <Button
              variant="default"
              onPress={() => setIsImportModalVisible(true)}
            >
              <View className="flex-row items-center">
                <Code2
                  color="var(--primary-foreground)"
                  size={18}
                  className="mr-2"
                />
                <Text className="text-primary-foreground font-bold">
                  {t("projects.import_github")}
                </Text>
              </View>
            </Button>

            <Button variant="outline" onPress={handleAddManual}>
              <View className="flex-row items-center">
                <Plus color="var(--text)" size={18} className="mr-2" />
                <Text className="text-text font-bold">
                  {t("projects.add_project")}
                </Text>
              </View>
            </Button>
          </View>

          <Text className="text-text text-xl font-bold mb-4">
            {t("projects.your_projects")}
          </Text>

          <View className="w-full h-[1px] bg-border mb-6" />

          {projects.length === 0 ? (
            <View className="border border-border border-dashed rounded-lg p-10 items-center justify-center bg-surface-elevated">
              <Folder
                color="var(--text-secondary)"
                size={48}
                className="mb-4"
              />
              <Text className="text-text-secondary text-center mb-6 max-w-sm leading-relaxed">
                {t("projects.empty_state")}
              </Text>
              <Button variant="outline" onPress={handleAddManual}>
                {t("projects.add_project")}
              </Button>
            </View>
          ) : (
            <View>
              {projects.map((p) => (
                <View
                  key={p.id}
                  className="border border-border rounded-xl p-6 mb-6 bg-surface"
                >
                  <View className="flex-row justify-between items-start mb-6">
                    <Text className="text-text font-bold text-lg">
                      {p.title || "Novo Projeto"}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeProject(p.id)}
                      className="p-2 bg-surface-elevated rounded-full"
                    >
                      <Trash2 color="var(--text-secondary)" size={16} />
                    </TouchableOpacity>
                  </View>

                  <FormField
                    label="Nome do Projeto"
                    value={p.title}
                    onChangeText={(text) =>
                      updateProject(p.id, { title: text })
                    }
                    placeholder="Project Title"
                  />

                  <FormField
                    label="Resumo"
                    placeholder="Descrição curta (1-2 frases)"
                    value={p.shortDescription}
                    onChangeText={(text) =>
                      updateProject(p.id, { shortDescription: text })
                    }
                  />

                  <FormField
                    variant="textarea"
                    label="Descrição completa"
                    placeholder="Full Description"
                    value={p.description}
                    onChangeText={(text) =>
                      updateProject(p.id, { description: text })
                    }
                  />

                  <FormField
                    label="Link (Demo ou Repositório)"
                    placeholder="https://..."
                    value={p.links?.demo || ""}
                    onChangeText={(text) =>
                      updateProject(p.id, { links: { ...p.links, demo: text } })
                    }
                    leadingIcon={
                      <LinkIcon color="var(--text-secondary)" size={16} />
                    }
                  />

                  <ImagePickerField
                    label="Imagem do Projeto"
                    value={p.image?.value}
                    isUrl={p.image?.type === "url"}
                    onChange={(value, isUrl) => {
                      if (value) {
                        updateProject(p.id, {
                          image: { type: isUrl ? "url" : "embedded", value },
                        });
                      } else {
                        updateProject(p.id, { image: undefined });
                      }
                    }}
                  />

                  {p.technologies.length > 0 && (
                    <View className="mt-2">
                      <Text className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-2">
                        Tecnologias
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {p.technologies.map((t) => (
                          <View
                            key={t}
                            className="border border-border rounded px-3 py-1.5 bg-input-background"
                          >
                            <Text className="text-text-secondary text-xs">
                              {t}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

        {errorMsg && (
          <View className="mb-6 bg-[#ef444420] border border-[#ef444440] p-4 rounded-lg flex-row items-center">
            <Text className="text-red-400 flex-1">{errorMsg}</Text>
          </View>
        )}
      </WizardScreen>

      <GitHubImportModal
        visible={isImportModalVisible}
        onClose={() => setIsImportModalVisible(false)}
        onImport={handleStartImport}
      />

      <GitHubProcessingModal
        visible={isProcessingModalVisible}
        reposToProcess={reposToProcess}
        onComplete={handleFinishProcessing}
        onCancel={() => setIsProcessingModalVisible(false)}
      />
    </>
  );
}
