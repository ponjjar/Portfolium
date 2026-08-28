import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { FileCode, Archive, Globe, X, FileJson } from 'lucide-react-native';
import { exportHtml, exportSessionJson } from './exportUtils';
import { usePortfolioStore } from '@/store';
import { buildPortfolioViewModel } from '@/templates/viewModel';
import { renderMinimalTemplate } from '@/templates/minimal';


interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ExportModal({ visible, onClose }: ExportModalProps) {
  const { session } = usePortfolioStore();

  const handleExportHtml = async () => {
    try {
      const viewModel = buildPortfolioViewModel(session);
      const html = renderMinimalTemplate(viewModel);
      await exportHtml(html);
    } catch (err) {
      console.error('Export HTML failed', err);
    }
  };

  const handleExportSession = async () => {
    try {
      const json = JSON.stringify(session, null, 2);
      await exportSessionJson(json);
    } catch (err) {
      console.error('Export Session failed', err);
    }
  };

  const handleExportZip = () => {
    // For future implementation if required
    alert('ZIP Export is coming soon!');
  };

  const handleExportGitHub = () => {
    // For future OAuth implementation
    alert('GitHub Pages integration is coming soon!');
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-background/80 justify-center items-center p-4">
        <View className="bg-surface-elevated w-full max-w-2xl rounded-2xl border border-border overflow-hidden shadow-xl p-6">
          
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-text text-2xl font-bold mb-2">Pronto para exportar</Text>
              <Text className="text-text-secondary">Escolha como deseja salvar ou publicar seu portfólio.</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X color="#666" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView className="max-h-[60vh]">
            <View className="flex-row flex-wrap gap-4">
              
              {/* HTML CARD */}
              <View className="w-[48%] bg-input-background border border-border rounded-xl p-5 mb-4">
                <View className="flex-row items-center mb-4">
                  <FileCode color="#fff" size={24} className="mr-3" />
                  <Text className="text-text font-bold text-lg tracking-widest uppercase">HTML</Text>
                </View>
                <Text className="text-text-secondary text-sm mb-6 h-12">
                  Baixe um único arquivo pronto para abrir ou publicar.
                </Text>
                <Button variant="default" className="w-full bg-primary" onPress={handleExportHtml}>
                  <Text className="text-primary-foreground font-bold text-center">Baixar HTML</Text>
                </Button>
              </View>

              {/* PROJECT CARD */}
              <View className="w-[48%] bg-input-background border border-border rounded-xl p-5 mb-4 opacity-50">
                <View className="flex-row items-center mb-4">
                  <Archive color="#fff" size={24} className="mr-3" />
                  <Text className="text-text font-bold text-lg tracking-widest uppercase">PROJETO</Text>
                </View>
                <Text className="text-text-secondary text-sm mb-6 h-12">
                  Baixe os arquivos do portfólio para continuar editando.
                </Text>
                <Button variant="outline" className="w-full" onPress={handleExportZip}>
                  <Text className="text-primary-foreground font-bold text-center">Baixar ZIP</Text>
                </Button>
              </View>

              {/* GITHUB PAGES CARD */}
              <View className="w-[48%] bg-input-background border border-border rounded-xl p-5 opacity-50">
                <View className="flex-row items-center mb-4">
                  <Globe color="#fff" size={24} className="mr-3" />
                  <Text className="text-text font-bold text-lg tracking-widest uppercase">GITHUB PAGES</Text>
                </View>
                <Text className="text-text-secondary text-sm mb-6 h-12">
                  Prepare os arquivos para publicar no GitHub Pages.
                </Text>
                <Button variant="outline" className="w-full" onPress={handleExportGitHub}>
                  <Text className="text-primary-foreground font-bold text-center">Preparar para GitHub Pages</Text>
                </Button>
              </View>

              {/* SESSION CARD */}
              <View className="w-[48%] bg-input-background border border-border rounded-xl p-5">
                <View className="flex-row items-center mb-4">
                  <FileJson color="#fff" size={24} className="mr-3" />
                  <Text className="text-text font-bold text-lg tracking-widest uppercase">SESSÃO</Text>
                </View>
                <Text className="text-text-secondary text-sm mb-6 h-12">
                  Salve seus dados para continuar depois.
                </Text>
                <Button variant="outline" className="w-full" onPress={handleExportSession}>
                  <Text className="text-primary-foreground font-bold text-center">Baixar sessão</Text>
                </Button>
              </View>

            </View>
          </ScrollView>

          <View className="mt-6 pt-4 border-t border-border flex-row justify-between items-center">
            <Text className="text-text-secondary text-xs">
              Sua sessão também foi salva automaticamente neste dispositivo.
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-text font-bold text-sm">Voltar ao editor</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
    </Modal>
  );
}
