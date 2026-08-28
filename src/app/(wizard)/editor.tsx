import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { usePortfolioStore } from '@/store';
import { getFirstIncompleteStep } from '@/domain/portfolio/validation';
import { buildPortfolioViewModel } from '@/templates/viewModel';
import { renderMinimalTemplate } from '@/templates/minimal';
import { exportHtml, exportSessionJson, exportZip, exportGitHubPagesReady } from '@/utils/export';
import { Button } from '@/components/ui/button';
import { ExportModal } from '@/components/modals/ExportModal';
import { Laptop, Smartphone, Download, User, Briefcase, Code, Settings, Palette } from 'lucide-react-native';
// @ts-ignore
import { WebView } from 'react-native-webview';

export default function EditorScreen() {
  const router = useRouter();
  const { session, updateTheme } = usePortfolioStore();
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [isExportVisible, setIsExportVisible] = useState(false);

  // Validation Check on Mount
  useEffect(() => {
    const incompleteStep = getFirstIncompleteStep(session);
    if (incompleteStep) {
      router.replace(`/(wizard)/${incompleteStep}`);
    }
  }, [session, router]);

  const viewModel = buildPortfolioViewModel(session);
  const htmlContent = renderMinimalTemplate(viewModel);

  const handleEdit = (step: string) => {
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

  return (
    <View className="flex-1 bg-background flex-row">
      
      {/* Sidebar Controls */}
      <View className="w-80 bg-input-background border-r border-border flex-col">
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

            <Text className="text-text text-sm mb-2">Tema</Text>
            <View className="flex-row gap-2 mb-6">
              <TouchableOpacity 
                onPress={() => updateTheme({ mode: 'light' })}
                className={`flex-1 py-2 rounded items-center border ${session.portfolio.theme.mode === 'light' ? 'border-primary bg-primary' : 'border-border bg-transparent'}`}
              >
                <Text className={session.portfolio.theme.mode === 'light' ? 'text-primary-foreground font-bold' : 'text-text'}>Claro</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => updateTheme({ mode: 'dark' })}
                className={`flex-1 py-2 rounded items-center border ${session.portfolio.theme.mode === 'dark' ? 'border-primary bg-primary' : 'border-border bg-transparent'}`}
              >
                <Text className={session.portfolio.theme.mode === 'dark' ? 'text-primary-foreground font-bold' : 'text-text'}>Escuro</Text>
              </TouchableOpacity>
            </View>
            
            <Text className="text-text text-sm mb-2">Cor de Destaque</Text>
            <View className="flex-row gap-2">
              {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#FFFFFF'].map(color => (
                <TouchableOpacity
                  key={color}
                  onPress={() => updateTheme({ accent: color })}
                  className="w-8 h-8 rounded-full border-2"
                  style={{ 
                    backgroundColor: color, 
                    borderColor: session.portfolio.theme.accent === color ? 'white' : 'transparent' 
                  }}
                />
              ))}
            </View>
          </View>

          {/* Content Editing */}
          <View className="p-6">
            <View className="flex-row items-center mb-4">
              <Settings color="var(--text-secondary)" size={16} className="mr-2" />
              <Text className="text-text-secondary text-xs font-bold uppercase tracking-widest">
                Conteúdo
              </Text>
            </View>

            <TouchableOpacity 
              onPress={() => handleEdit('profile')}
              className="flex-row items-center bg-[#1a1a1a] p-3 rounded mb-2 border border-border"
            >
              <User color="var(--text)" size={16} className="mr-3" />
              <Text className="text-text flex-1">Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleEdit('projects')}
              className="flex-row items-center bg-[#1a1a1a] p-3 rounded mb-2 border border-border"
            >
              <Briefcase color="var(--text)" size={16} className="mr-3" />
              <Text className="text-text flex-1">Editar Projetos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleEdit('skills')}
              className="flex-row items-center bg-[#1a1a1a] p-3 rounded mb-2 border border-border"
            >
              <Code color="var(--text)" size={16} className="mr-3" />
              <Text className="text-text flex-1">Editar Tecnologias</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View className="p-6 border-t border-border">
          <Button onPress={() => setIsExportVisible(true)} className="w-full">
            <View className="flex-row items-center justify-center w-full">
              <Download color="#000" size={16} className="mr-2" />
              <Text className="text-black font-bold">Exportar Portfólio</Text>
            </View>
          </Button>
        </View>
      </View>

      {/* Preview Area */}
      <View className="flex-1 flex-col bg-background">
        
        {/* Preview Toolbar */}
        <View className="h-14 border-b border-border flex-row items-center justify-center bg-input-background">
          <View className="flex-row bg-surface-elevated p-1 rounded-lg">
            <TouchableOpacity 
              onPress={() => setViewport('desktop')}
              className={`p-2 rounded ${viewport === 'desktop' ? 'bg-[#333]' : 'bg-transparent'}`}
            >
              <Laptop color={viewport === 'desktop' ? 'var(--text)' : 'var(--text-secondary)'} size={18} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setViewport('mobile')}
              className={`p-2 rounded ${viewport === 'mobile' ? 'bg-[#333]' : 'bg-transparent'}`}
            >
              <Smartphone color={viewport === 'mobile' ? 'var(--text)' : 'var(--text-secondary)'} size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Preview */}
        <View className="flex-1 items-center justify-center p-4">
          <View 
            className="bg-white border border-border shadow-lg overflow-hidden transition-all duration-300 ease-in-out"
            style={{ 
              width: viewport === 'mobile' ? 375 : '100%', 
              height: '100%',
              maxWidth: 1200,
              borderRadius: viewport === 'mobile' ? 32 : 8
            }}
          >
            {Platform.OS === 'web' ? (
              <iframe 
                srcDoc={htmlContent} 
                style={{ width: '100%', height: '100%', border: 'none' }} 
                sandbox="allow-scripts"
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

      <ExportModal 
        visible={isExportVisible} 
        onClose={() => setIsExportVisible(false)} 
        onExportHtml={handleExportHtml}
        onExportJson={handleExportJson}
        onExportZip={handleExportZip}
        onExportGitHubPages={handleExportGitHubPages}
      />
    </View>
  );
}
