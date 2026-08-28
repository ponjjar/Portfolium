import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Modal } from '@/components/ui/modal';
import { GitHubNotFoundError, normalizeGitHubUsername } from '@/services/github/github-client';
import { fetchAllPublicRepositories, fetchGitHubUser } from '@/services/github/github-repositories';
import { extractReadmeImages, ImageCandidate } from '@/services/github/github-readme';
import { GitHubRepositorySummary } from '@/services/github/github.schemas';
import { usePortfolioStore } from '@/store';
import { AlertCircle, CheckCircle2, Circle, Code2, Search, Edit2, ImageIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { ProjectImageSelectionModal } from '../modals/ProjectImageSelectionModal';

interface GitHubImportModalProps {
  visible: boolean;
  onClose: () => void;
  onImport: (repos: GitHubRepositorySummary[]) => void;
}

export function GitHubImportModal({ visible, onClose, onImport }: GitHubImportModalProps) {
  const existingProjects = usePortfolioStore((s) => s.session.projects);
  const socialLinks = usePortfolioStore((s) => s.session.socialLinks);
  const [step, setStep] = useState<'input' | 'loading' | 'select'>('input');

  const [usernameInput, setUsernameInput] = useState('');
  const [repositories, setRepositories] = useState<GitHubRepositorySummary[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'sources' | 'forks' | 'archived'>('all');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Tracks the image candidates and selected index for each repo
  const [repoImages, setRepoImages] = useState<Record<number, { status: 'loading' | 'done', candidates: ImageCandidate[], selectedCandidateIndex: number | null }>>({});

  // Image editing modal state
  const [editingRepoId, setEditingRepoId] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      // Avoid setting state unconditionally here if it causes loops, but we can set it via a timeout or before opening
      const githubLink = socialLinks.find(link => link.type === 'github');
      if (githubLink) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUsernameInput(normalizeGitHubUsername(githubLink.url));
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUsernameInput('');
      }

      setRepositories([]);
      setSelectedIds(new Set());
      setSearchQuery('');
      setFilter('all');
      setError(null);
      setRepoImages({});
      setEditingRepoId(null);
    }
  }, [visible, socialLinks]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const username = normalizeGitHubUsername(usernameInput);
      const user = await fetchGitHubUser(username);
      const repos = await fetchAllPublicRepositories(user.login);
      setRepositories(repos);
      setStep('select');
    } catch (err: any) {
      if (err instanceof GitHubNotFoundError) {
        setError('Não encontramos esse usuário no GitHub.');
      } else {
        setError('Não foi possível acessar o GitHub. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmImport = () => {
    const toImport = repositories.filter(r => selectedIds.has(r.id)).map(r => {
      // Attach selected image to the repo summary
      const imgState = repoImages[r.id];
      if (imgState && imgState.status === 'done' && imgState.selectedCandidateIndex !== null && imgState.selectedCandidateIndex >= 0) {
        const candidate = imgState.candidates[imgState.selectedCandidateIndex];
        return {
          ...r,
          selectedImage: {
            type: 'url',
            value: candidate.url,
            source: 'github-readme',
            width: candidate.width,
            height: candidate.height,
          }
        };
      } else if (imgState && imgState.status === 'done' && r.selectedImage) {
        // manual image might already be attached to r if edited
        return r;
      }
      return r;
    });
    onImport(toImport);
  };

  const extractImagesForRepo = async (repo: GitHubRepositorySummary) => {
    if (repoImages[repo.id]) return; // Already loading or done
    
    setRepoImages(prev => ({ ...prev, [repo.id]: { status: 'loading', candidates: [], selectedCandidateIndex: null } }));
    
    const candidates = await extractReadmeImages(repo);
    
    setRepoImages(prev => ({
      ...prev,
      [repo.id]: {
        status: 'done',
        candidates,
        selectedCandidateIndex: candidates.length > 0 ? 0 : null
      }
    }));
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredRepos.length) {
      setSelectedIds(new Set());
    } else {
      const newSet = new Set<number>();
      filteredRepos.forEach(r => {
        newSet.add(r.id);
        extractImagesForRepo(r);
      });
      setSelectedIds(newSet);
    }
  };

  const toggleSelect = (repo: GitHubRepositorySummary) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(repo.id)) {
      newSet.delete(repo.id);
    } else {
      newSet.add(repo.id);
      extractImagesForRepo(repo);
    }
    setSelectedIds(newSet);
  };

  const filteredRepos = repositories.filter(repo => {
    if (searchQuery && !repo.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filter === 'sources' && repo.isFork) return false;
    if (filter === 'forks' && !repo.isFork) return false;
    if (filter === 'archived' && !repo.isArchived) return false;
    return true;
  });

  const renderFooter = () => {
    if (step !== 'select') return null;
    return (
      <View className="flex-1 flex-row items-center justify-between w-full">
        <Text className="text-text-secondary text-sm">
          {selectedIds.size} projeto{selectedIds.size !== 1 ? 's' : ''} selecionado{selectedIds.size !== 1 ? 's' : ''}
        </Text>
        <Button
          onPress={handleConfirmImport}
          disabled={selectedIds.size === 0}
          className="px-6"
        >
          <Text className="text-primary-foreground font-bold">
            Importar projeto{selectedIds.size !== 1 ? 's' : ''}
          </Text>
        </Button>
      </View>
    );
  };

  const editingRepo = editingRepoId ? repositories.find(r => r.id === editingRepoId) : null;
  const editingRepoImageState = editingRepo ? repoImages[editingRepo.id] : null;

  return (
    <>
      <Modal visible={visible} onClose={onClose} title="Importar projetos do GitHub" size="lg" footer={renderFooter()}>
        <View className="flex-1">
          {step === 'input' && (
            <View className="flex-1 py-6 justify-center">
              <View className="mb-6 items-center">
                <Code2 color="var(--text)" size={48} className="mb-4" />
                <Text className="text-text font-bold text-xl mb-2 text-center">Confirme o usuário do GitHub</Text>
              </View>

              <FormField
                label="Username ou URL do perfil"
                placeholder="ex: github.com/seu-usuario ou apenas 'seu-usuario'"
                value={usernameInput}
                onChangeText={setUsernameInput}
                onSubmitEditing={handleSearch}
                autoCapitalize="none"
                autoCorrect={false}
                leadingIcon={<Code2 color="var(--text-secondary)" size={16} />}
              />

              {error && (
                <View className="bg-red-500/10 p-4 rounded mb-4 flex-row items-center">
                  <AlertCircle color="#ef4444" size={20} className="mr-2" />
                  <Text className="text-red-500 flex-1">{error}</Text>
                </View>
              )}

              <Button onPress={handleSearch} disabled={!usernameInput.trim()}>
                <Text className="text-primary-foreground font-bold">Buscar repositórios</Text>
              </Button>
            </View>
          )}

          {step === 'loading' && (
            <View className="flex-1 p-6 items-center justify-center">
              <ActivityIndicator size="large" color="var(--text)" className="mb-4" />
              <Text className="text-text text-lg font-bold">Buscando repositórios...</Text>
            </View>
          )}

          {step === 'select' && (
            <View className="flex-1">
              <View className="pb-4 border-b border-border">
                <FormField
                  placeholder="Filtrar projetos..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                  autoCorrect={false}
                  leadingIcon={<Search color="var(--text-secondary)" size={16} />}
                />

                <View className="flex-row gap-2 mt-4">
                  {(['all', 'sources', 'forks', 'archived'] as const).map(f => (
                    <TouchableOpacity
                      key={f}
                      onPress={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-full border ${filter === f ? 'bg-primary border-primary' : 'bg-transparent border-border'
                        }`}
                    >
                      <Text className={`text-xs capitalize ${filter === f ? 'text-primary-foreground font-bold' : 'text-text-secondary'}`}>
                        {f}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="flex-row items-center justify-between py-3 border-b border-border">
                <TouchableOpacity onPress={toggleSelectAll} className="flex-row items-center">
                  {selectedIds.size === filteredRepos.length && filteredRepos.length > 0 ? (
                    <CheckCircle2 color="#10b981" size={20} className="mr-2" />
                  ) : (
                    <Circle color="#666" size={20} className="mr-2" />
                  )}
                  <Text className="text-text font-bold">Escolha os projetos que deseja importar ({filteredRepos.length})</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSelectedIds(new Set())}>
                  <Text className="text-text-secondary">Clear</Text>
                </TouchableOpacity>
              </View>

              <View className="pt-4">
                {filteredRepos.length === 0 ? (
                  <View className="py-10 items-center justify-center">
                    <Text className="text-text-secondary text-center">Nenhum repositório encontrado com esses filtros.</Text>
                  </View>
                ) : (
                  filteredRepos.map(repo => {
                    const isSelected = selectedIds.has(repo.id);
                    const isAlreadyImported = existingProjects.some(
                      p => p.source.type === 'github' && p.source.repository.url === repo.htmlUrl
                    );
                    const imgState = repoImages[repo.id];
                    let currentImage: string | null = null;
                    if (repo.selectedImage?.value) {
                      currentImage = repo.selectedImage.value;
                    } else if (imgState?.status === 'done' && imgState.selectedCandidateIndex !== null && imgState.selectedCandidateIndex >= 0) {
                      currentImage = imgState.candidates[imgState.selectedCandidateIndex].url;
                    }

                    return (
                      <View
                        key={repo.id}
                        className={`flex-row items-center p-3 mb-3 rounded border ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-surface'
                          } ${isAlreadyImported ? 'opacity-50' : ''}`}
                      >
                        <TouchableOpacity 
                          onPress={() => toggleSelect(repo)}
                          disabled={isAlreadyImported}
                          className="mr-3 p-1"
                        >
                          {isSelected ? (
                            <CheckCircle2 color="#10b981" size={20} />
                          ) : (
                            <Circle color="#666" size={20} />
                          )}
                        </TouchableOpacity>

                        {/* Thumbnail */}
                        <View className="w-12 h-12 rounded bg-input-background overflow-hidden mr-3 items-center justify-center border border-border/50">
                          {imgState?.status === 'loading' ? (
                            <ActivityIndicator size="small" color="var(--text-secondary)" />
                          ) : currentImage ? (
                            <Image 
                              source={{ uri: currentImage }} 
                              style={{ width: '100%', height: '100%' }} 
                              resizeMode="cover" 
                            />
                          ) : (
                            <ImageIcon color="var(--text-muted)" size={16} />
                          )}
                        </View>

                        <View className="flex-1 justify-center">
                          <View className="flex-row items-center flex-wrap mb-0.5">
                            <Text className="text-text font-bold text-base mr-2">{repo.name}</Text>
                            {isAlreadyImported && (
                              <View className="bg-green-500/20 px-1.5 py-0.5 rounded mr-2">
                                <Text className="text-green-500 text-[9px] font-bold">IMPORTED</Text>
                              </View>
                            )}
                            {repo.isFork && (
                              <View className="bg-surface-elevated px-1.5 py-0.5 rounded mr-2">
                                <Text className="text-text-secondary text-[9px] font-bold">FORK</Text>
                              </View>
                            )}
                            {repo.isArchived && (
                              <View className="bg-yellow-500/20 px-1.5 py-0.5 rounded mr-2">
                                <Text className="text-yellow-500 text-[9px] font-bold">ARCHIVED</Text>
                              </View>
                            )}
                          </View>

                          <View className="flex-row items-center flex-wrap gap-x-2 gap-y-1">
                            {repo.language && (
                              <Text className="text-xs text-blue-400">{repo.language}</Text>
                            )}
                            <Text className="text-[10px] text-text-secondary" numberOfLines={1} style={{ maxWidth: 200 }}>
                              {repo.description || "Sem descrição"}
                            </Text>
                          </View>
                        </View>

                        {isSelected && imgState?.status === 'done' && (
                          <TouchableOpacity 
                            onPress={() => setEditingRepoId(repo.id)}
                            className="p-2 ml-2 bg-surface-elevated rounded-full"
                          >
                            <Edit2 color="var(--text-secondary)" size={16} />
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })
                )}
              </View>
            </View>
          )}
        </View>
      </Modal>

      {editingRepo && editingRepoImageState && (
        <ProjectImageSelectionModal
          visible={true}
          onClose={() => setEditingRepoId(null)}
          projectName={editingRepo.name}
          candidates={editingRepoImageState.candidates}
          onConfirm={(image) => {
            // Update the repo manually selected image or candidate index
            if (image && image.source === 'manual') {
              const updatedRepo = { ...editingRepo, selectedImage: image };
              
              setRepoImages(prev => ({
                ...prev,
                [editingRepo.id]: {
                  status: 'done',
                  candidates: prev[editingRepo.id]?.candidates || [],
                  selectedCandidateIndex: null
                }
              }));
              
              setRepositories(repos => repos.map(r => r.id === updatedRepo.id ? updatedRepo : r));
              
            } else if (image) {
              const idx = editingRepoImageState.candidates.findIndex(c => c.url === image.value);
              setRepoImages(prev => ({
                ...prev,
                [editingRepo.id]: {
                  status: 'done',
                  candidates: prev[editingRepo.id]?.candidates || [],
                  selectedCandidateIndex: idx >= 0 ? idx : null
                }
              }));
              const updatedRepo = { ...editingRepo, selectedImage: undefined };
              setRepositories(repos => repos.map(r => r.id === updatedRepo.id ? updatedRepo : r));
            } else {
              setRepoImages(prev => ({
                ...prev,
                [editingRepo.id]: {
                  status: 'done',
                  candidates: prev[editingRepo.id]?.candidates || [],
                  selectedCandidateIndex: null
                }
              }));
              
              const updatedRepo = { ...editingRepo, selectedImage: undefined };
              setRepositories(repos => repos.map(r => r.id === updatedRepo.id ? updatedRepo : r));
            }
            setEditingRepoId(null);
          }}
        />
      )}
    </>
  );
}
