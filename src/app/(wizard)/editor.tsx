import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { usePortfolioStore } from '@/store';
import { getFirstIncompleteStep } from '@/domain/portfolio/validation';
import { buildPortfolioViewModel } from '@/templates/viewModel';
import { renderMinimalTemplate } from '@/templates/minimal';
import { exportHtml, exportSessionJson, exportZip, exportGitHubPagesReady } from '@/utils/export';
import { Button } from '@/components/ui/button';
import { ExportModal } from '@/components/modals/ExportModal';
import { Laptop, Smartphone, Download, Settings, Palette, Eye, ArrowLeft, LayoutTemplate, User, Briefcase, MonitorSmartphone } from 'lucide-react-native';
import { SortableSectionList } from '@/components/ui/SortableSectionList';
import { ProfileCenterOrbitModal, OrbitItem } from '@/components/modals/ProfileCenterOrbitModal';
import { ProfileLayoutModal } from '@/components/modals/ProfileLayoutModal';
import { ProjectLayoutModal } from '@/components/modals/ProjectLayoutModal';
import { HeaderConfigModal } from '@/components/modals/HeaderConfigModal';
import { VisualThemeModal } from '@/components/modals/VisualThemeModal';
import { CustomOrbitBuilderModal } from '@/components/modals/CustomOrbitBuilderModal';

// @ts-ignore
import { WebView } from 'react-native-webview';

export default function EditorScreen() {
  const router = useRouter();
  const { session, updateTheme, updateConfig } = usePortfolioStore();
  const { width } = useWindowDimensions();
  
  const isMobile = width < 768;
  
  // State
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [isExportVisible, setIsExportVisible] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Modals
  const [orbitModalVisible, setOrbitModalVisible] = useState(false);
  const [customOrbitVisible, setCustomOrbitVisible] = useState(false);
  const [profileLayoutModalVisible, setProfileLayoutModalVisible] = useState(false);
  const [projectLayoutModalVisible, setProjectLayoutModalVisible] = useState(false);
  const [headerModalVisible, setHeaderModalVisible] = useState(false);
  const [visualThemeModalVisible, setVisualThemeModalVisible] = useState(false);

  // Validation Check on Mount
  useEffect(() => {
    const incompleteStep = getFirstIncompleteStep(session);
    if (incompleteStep) {
      router.replace(`/(wizard)/${incompleteStep}`);
    }
  }, [session, router]);

  const viewModel = buildPortfolioViewModel(session);
  const htmlContent = renderMinimalTemplate(viewModel);

  const handleEditSection = (step: string) => {
    router.push({ pathname: `/(wizard)/${step}` as any, params: { returnTo: 'editor' } });
  };

  const handleExportHtml = async () => {
    try {
      await exportHtml(session);
      setIsExportVisible(false);
    } catch (e) {
      alert('Erro ao exportar HTML');
    }
  };

  const handleExportJson = async () => {
    try {
      await exportSessionJson(session);
      setIsExportVisible(false);
    } catch (e) {
      alert('Erro ao exportar JSON');
    }
  };

  const handleExportZip = async () => {
    try {
      await exportZip(session);
      setIsExportVisible(false);
    } catch (e) {
      alert('Erro ao exportar ZIP');
    }
  };
  
  const handleExportGitHubPages = async () => {
    try {
      await exportGitHubPagesReady(session);
      setIsExportVisible(false);
      alert('Extraia o conteúdo do ZIP no seu repositório github.io.');
    } catch (e) {
      alert('Erro ao exportar para GitHub Pages');
    }
  };

  // ----------------------------------------------------
  // SIDEBAR RENDER
  // ----------------------------------------------------
  const renderSidebar = () => (
    <View className={`bg-input-background border-r border-border flex-col ${isMobile ? 'flex-1' : 'w-80'}`}>
      <View className="p-6 border-b border-border">
        <Text className="text-text font-bold text-xl mb-1">Editor Final</Text>
        <Text className="text-text-secondary text-xs">Revise e customize seu portfólio.</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Customization */}
        <View className="p-6 border-b border-border">
          <View className="flex-row items-center mb-4">
            <Palette color="var(--text-secondary)" size={16} className="mr-2" />
            <Text className="text-text-secondary text-xs font-bold uppercase tracking-widest">
              Personalizar
            </Text>
          </View>

          <View className="gap-2 mb-6">
            <TouchableOpacity 
              onPress={() => setVisualThemeModalVisible(true)}
              className="flex-row items-center justify-between bg-surface p-3 rounded border border-border"
            >
              <View className="flex-row items-center">
                <Palette color="var(--text)" size={16} className="mr-3" />
                <Text className="text-text font-bold text-sm">Tema Visual e Efeitos</Text>
              </View>
              <Text className="text-text-secondary text-xs">{session.portfolio.visualTheme?.preset || 'dark'} &gt;</Text>
            </TouchableOpacity>
          </View>

          {/* Layout Pickers */}
          <View className="gap-2">
            <TouchableOpacity 
              onPress={() => setProfileLayoutModalVisible(true)}
              className="flex-row items-center justify-between bg-surface p-3 rounded border border-border"
            >
              <View className="flex-row items-center">
                <User color="var(--text)" size={16} className="mr-3" />
                <Text className="text-text font-bold text-sm">Layout do Perfil</Text>
              </View>
              <Text className="text-text-secondary text-xs">{
                session.portfolio.layout.profile.variant === 'stacked-center' ? 'Empilhado' : 
                session.portfolio.layout.profile.variant === 'avatar-side' ? 'Lateral' : 'Orbital'
              } &gt;</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setProjectLayoutModalVisible(true)}
              className="flex-row items-center justify-between bg-surface p-3 rounded border border-border"
            >
              <View className="flex-row items-center">
                <Briefcase color="var(--text)" size={16} className="mr-3" />
                <Text className="text-text font-bold text-sm">Layout dos Projetos</Text>
              </View>
              <Text className="text-text-secondary text-xs">{session.portfolio.layout.projects.carousel?.enabled ? 'Carrossel' : 'Grade'} &gt;</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setHeaderModalVisible(true)}
              className="flex-row items-center justify-between bg-surface p-3 rounded border border-border"
            >
              <View className="flex-row items-center">
                <MonitorSmartphone color="var(--text)" size={16} className="mr-3" />
                <Text className="text-text font-bold text-sm">Cabeçalho</Text>
              </View>
              <Text className="text-text-secondary text-xs">{session.portfolio.layout.header?.enabled ? 'Ativo' : 'Oculto'} &gt;</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Options */}
        <View className="p-6 border-b border-border">
          <View className="flex-row items-center mb-4">
            <Settings color="var(--text-secondary)" size={16} className="mr-2" />
            <Text className="text-text-secondary text-xs font-bold uppercase tracking-widest">
              Opções
            </Text>
          </View>
          <TouchableOpacity 
            className="flex-row items-center mb-2"
            onPress={() => updateConfig({ animations: { revealOnScroll: !session.portfolio.animations.revealOnScroll } })}
          >
            <View className={`w-4 h-4 rounded border mr-2 items-center justify-center ${session.portfolio.animations.revealOnScroll ? 'bg-primary border-primary' : 'border-border bg-input-background'}`}>
              {session.portfolio.animations.revealOnScroll && <View className="w-2 h-2 bg-primary-foreground rounded-sm" />}
            </View>
            <Text className="text-text text-sm">Animações de rolagem</Text>
          </TouchableOpacity>
        </View>

        {/* Content Editing (Sortable) */}
        <View className="p-6 pb-20">
          <View className="flex-row items-center mb-4">
            <LayoutTemplate color="var(--text-secondary)" size={16} className="mr-2" />
            <Text className="text-text-secondary text-xs font-bold uppercase tracking-widest">
              Seções
            </Text>
          </View>

          <SortableSectionList 
            sections={session.portfolio.sections.filter(s => 
              !(s.id === 'skills' && session.portfolio.layout.profile.embedsTechnologies)
            )} 
            onReorder={(sections) => {
              // Maintain any hidden sections in their existing order relative to the updated ones
              const hiddenSections = session.portfolio.sections.filter(s => 
                s.id === 'skills' && session.portfolio.layout.profile.embedsTechnologies
              );
              updateConfig({ sections: [...sections, ...hiddenSections] });
            }} 
            onEdit={handleEditSection}
          />
        </View>
      </ScrollView>

      {/* Export / Actions Footer */}
      {!isMobile ? (
        <View className="p-6 border-t border-border">
          <Button onPress={() => setIsExportVisible(true)} className="w-full">
            <Download color="var(--primary-foreground)" size={16} />
            Exportar Portfólio
          </Button>
        </View>
      ) : (
        <View className="absolute bottom-6 left-6 right-6">
          <Button onPress={() => setShowMobilePreview(true)} className="w-full shadow-lg h-14">
            <Eye color="var(--primary-foreground)" size={18} />
            <Text className="font-bold text-lg">Visualizar portfólio</Text>
          </Button>
        </View>
      )}
    </View>
  );

  // ----------------------------------------------------
  // PREVIEW RENDER
  // ----------------------------------------------------
  const renderPreview = () => (
    <View className="flex-1 flex-col bg-background">
      {/* Mobile Top Bar */}
      {isMobile && (
        <View className="h-14 border-b border-border flex-row items-center justify-between px-4 bg-surface">
          <TouchableOpacity onPress={() => setShowMobilePreview(false)} className="flex-row items-center p-2">
            <ArrowLeft color="var(--text)" size={18} className="mr-2" />
            <Text className="text-text font-bold">Voltar</Text>
          </TouchableOpacity>
          <Button onPress={() => setIsExportVisible(true)} size="sm">
            <Download color="var(--primary-foreground)" size={14} className="mr-1" />
            Exportar
          </Button>
        </View>
      )}

      {/* Preview Toolbar */}
      <View className="h-14 border-b border-border flex-row items-center justify-center bg-input-background z-10">
        <View className="flex-row bg-surface-elevated p-1 rounded-lg">
          <TouchableOpacity 
            onPress={() => setViewport('desktop')}
            className={`p-2 rounded ${viewport === 'desktop' ? 'bg-border' : 'bg-transparent'}`}
          >
            <Laptop color={viewport === 'desktop' ? 'var(--text)' : 'var(--text-secondary)'} size={18} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setViewport('mobile')}
            className={`p-2 rounded ${viewport === 'mobile' ? 'bg-border' : 'bg-transparent'}`}
          >
            <Smartphone color={viewport === 'mobile' ? 'var(--text)' : 'var(--text-secondary)'} size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Live Preview Content */}
      <View className="flex-1 items-center justify-center overflow-hidden bg-background">
        <View 
          className="bg-background border border-border shadow-lg transition-all duration-300 ease-in-out"
          style={{ 
            width: viewport === 'desktop' && isMobile ? 1440 : (viewport === 'mobile' ? 375 : '100%'), 
            height: viewport === 'desktop' && isMobile ? (1440 / width) * 100 + '%' : '100%',
            maxWidth: viewport === 'desktop' && !isMobile ? 1200 : undefined,
            transform: viewport === 'desktop' && isMobile ? [{ scale: width / 1440 }] : [],
            transformOrigin: 'top left',
            borderRadius: viewport === 'mobile' ? 32 : 8,
            overflow: 'hidden'
          }}
        >
          {Platform.OS === 'web' ? (
            <iframe 
              srcDoc={htmlContent} 
              style={{ width: '100%', height: '100%', border: 'none' }} 
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <WebView 
              source={{ html: htmlContent }} 
              style={{ flex: 1 }} 
            />
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 flex-row">
      {/* If Desktop: Sidebar | Preview */}
      {/* If Mobile: conditional based on showMobilePreview */}
      {(!isMobile || !showMobilePreview) && renderSidebar()}
      {(!isMobile || showMobilePreview) && renderPreview()}

      {/* Modals */}
      <ExportModal 
        visible={isExportVisible} 
        onClose={() => setIsExportVisible(false)} 
        onExportHtml={handleExportHtml}
        onExportJson={handleExportJson}
        onExportZip={handleExportZip}
        onExportGitHubPages={handleExportGitHubPages}
      />

      <ProfileLayoutModal
        visible={profileLayoutModalVisible}
        onClose={() => setProfileLayoutModalVisible(false)}
        currentVariant={session.portfolio.layout.profile.variant}
        avatarStyle={session.portfolio.layout.profile.avatarStyle as any}
        onSelectVariant={(variant) => {
          updateConfig({ layout: { ...session.portfolio.layout, profile: { ...session.portfolio.layout.profile, variant } } });
        }}
        onUpdateAvatarStyle={(avatarStyle) => {
          updateConfig({ layout: { ...session.portfolio.layout, profile: { ...session.portfolio.layout.profile, avatarStyle } } });
        }}
        onOpenOrbitSettings={() => {
          setProfileLayoutModalVisible(false);
          setOrbitModalVisible(true);
        }}
        onOpenCustomOrbitBuilder={() => {
          setProfileLayoutModalVisible(false);
          setCustomOrbitVisible(true);
        }}
      />

      <ProjectLayoutModal
        visible={projectLayoutModalVisible}
        onClose={() => setProjectLayoutModalVisible(false)}
        config={session.portfolio.layout.projects as any}
        onUpdate={(config) => {
          updateConfig({ layout: { ...session.portfolio.layout, projects: config } });
        }}
      />

      <HeaderConfigModal
        visible={headerModalVisible}
        onClose={() => setHeaderModalVisible(false)}
        config={(session.portfolio.layout.header || { enabled: false, showNavigation: true, showName: true, showAvatar: true, namePosition: 'left' }) as any}
        onUpdate={(config) => {
          updateConfig({ layout: { ...session.portfolio.layout, header: config } });
        }}
      />

      <ProfileCenterOrbitModal
        visible={orbitModalVisible}
        onClose={() => setOrbitModalVisible(false)}
        order={session.portfolio.layout.profile.cornerItemsOrder as OrbitItem[]}
        onUpdateOrder={(newOrder) => {
          updateConfig({ 
            layout: { 
              ...session.portfolio.layout, 
              profile: { ...session.portfolio.layout.profile, cornerItemsOrder: newOrder } 
            } 
          });
        }}
      />

      <VisualThemeModal
        visible={visualThemeModalVisible}
        onClose={() => setVisualThemeModalVisible(false)}
        config={{
          preset: session.portfolio.visualTheme?.preset || 'dark',
          accent: session.portfolio.visualTheme?.accent || session.portfolio.theme.accent,
          backgroundEffects: session.portfolio.visualTheme?.backgroundEffects || {
            glows: { enabled: false, intensity: 'medium', color: '#3b82f6', count: 2 },
            microStars: { enabled: false, density: 'low', opacity: 0.3 }
          }
        }}
        onUpdate={(config) => {
          // Update both new visualTheme and backwards compatible theme
          updateTheme({ mode: config.preset.includes('light') ? 'light' : 'dark', accent: config.accent });
          updateConfig({ visualTheme: config });
        }}
      />

      <CustomOrbitBuilderModal
        visible={customOrbitVisible}
        onClose={() => setCustomOrbitVisible(false)}
        zones={session.portfolio.layout.profile.zones as any || { center: 'avatar', topLeft: 'name', topRight: 'headline', left: 'links', right: '', topCenter: '', bottomLeft: 'description', bottomRight: 'technologies' }}
        embedsTechnologies={session.portfolio.layout.profile.embedsTechnologies || false}
        onUpdateZones={(zones) => {
          updateConfig({ 
            layout: { 
              ...session.portfolio.layout, 
              profile: { ...session.portfolio.layout.profile, zones } 
            } 
          });
        }}
        onUpdateEmbedsTech={(embedsTechnologies) => {
          updateConfig({ 
            layout: { 
              ...session.portfolio.layout, 
              profile: { ...session.portfolio.layout.profile, embedsTechnologies } 
            } 
          });
        }}
      />
    </View>
  );
}
