import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { User, Briefcase, FileText, Link as LinkIcon, Code } from 'lucide-react-native';

export interface OrbitZones {
  topLeft: string;
  topCenter: string;
  topRight: string;
  left: string;
  center: string;
  right: string;
  bottomLeft: string;
  bottomRight: string;
}

interface CustomOrbitBuilderModalProps {
  visible: boolean;
  onClose: () => void;
  zones: OrbitZones;
  embedsTechnologies: boolean;
  onUpdateZones: (zones: OrbitZones) => void;
  onUpdateEmbedsTech: (embeds: boolean) => void;
}

const AVAILABLE_COMPONENTS = [
  { id: '', label: 'Vazio', icon: null },
  { id: 'name', label: 'Nome', icon: <User size={14} color="var(--text)" /> },
  { id: 'headline', label: 'Headline', icon: <Briefcase size={14} color="var(--text)" /> },
  { id: 'links', label: 'Links Principais', icon: <LinkIcon size={14} color="var(--text)" /> },
  { id: 'description', label: 'Bio / Descrição', icon: <FileText size={14} color="var(--text)" /> },
  { id: 'technologies', label: 'Tecnologias', icon: <Code size={14} color="var(--text)" /> },
  { id: 'otherLinks', label: 'Outros Links', icon: <LinkIcon size={14} color="var(--text)" /> },
];

export function CustomOrbitBuilderModal({ visible, onClose, zones, embedsTechnologies, onUpdateZones, onUpdateEmbedsTech }: CustomOrbitBuilderModalProps) {
  const [activeZone, setActiveZone] = React.useState<keyof OrbitZones | null>(null);

  const handleZoneSelect = (zoneKey: keyof OrbitZones) => {
    if (zoneKey === 'center') return; // Avatar is fixed for now
    setActiveZone(zoneKey);
  };

  const handleComponentAssign = (compId: string) => {
    if (activeZone) {
      onUpdateZones({ ...zones, [activeZone]: compId });
      setActiveZone(null);
    }
  };

  const getCompLabel = (id: string) => AVAILABLE_COMPONENTS.find(c => c.id === id)?.label || 'Vazio';

  const ZoneBox = ({ zoneKey, label }: { zoneKey: keyof OrbitZones, label: string }) => {
    const isCenter = zoneKey === 'center';
    const compId = zones[zoneKey];
    const compLabel = isCenter ? 'Avatar (Fixo)' : getCompLabel(compId);
    
    return (
      <TouchableOpacity 
        className={`flex-1 m-1 border-2 rounded-xl justify-center items-center p-2 h-20 ${activeZone === zoneKey ? 'border-primary bg-primary/20' : isCenter ? 'border-primary/50 bg-primary/10' : compId ? 'border-border bg-surface-elevated' : 'border-dashed border-border bg-transparent'}`}
        onPress={() => handleZoneSelect(zoneKey)}
        activeOpacity={isCenter ? 1 : 0.7}
      >
        {isCenter ? (
          <View className="w-10 h-10 rounded-full bg-primary/30 items-center justify-center mb-1">
            <User size={16} color="var(--primary)" />
          </View>
        ) : null}
        <Text className={`text-xs text-center ${compId || isCenter ? 'font-bold text-text' : 'text-text-muted'}`}>
          {compLabel}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      onClose={() => { setActiveZone(null); onClose(); }}
      title="Custom Orbit Builder"
      size="md"
      footer={
        <Button variant="default" className="w-full" onPress={() => { setActiveZone(null); onClose(); }}>
          <Text className="text-primary-foreground font-bold">Concluir</Text>
        </Button>
      }
    >
      <ScrollView className="py-2">
        <Text className="text-text-secondary text-sm mb-4">
          Toque em uma zona ao redor do avatar para escolher qual componente será exibido nela.
        </Text>

        <View className="bg-input-background p-4 rounded-xl border border-border mb-6">
          <View className="flex-row">
            <ZoneBox zoneKey="topLeft" label="Top Left" />
            <ZoneBox zoneKey="topCenter" label="Top Center" />
            <ZoneBox zoneKey="topRight" label="Top Right" />
          </View>
          <View className="flex-row">
            <ZoneBox zoneKey="left" label="Left" />
            <ZoneBox zoneKey="center" label="Center" />
            <ZoneBox zoneKey="right" label="Right" />
          </View>
          <View className="flex-row">
            <ZoneBox zoneKey="bottomLeft" label="Bottom Left" />
            <View className="flex-1 m-1" />
            <ZoneBox zoneKey="bottomRight" label="Bottom Right" />
          </View>
        </View>

        {activeZone && (
          <View className="bg-surface rounded-xl border border-primary p-4 mb-6">
            <Text className="text-primary font-bold text-sm mb-3 uppercase">Selecione para a zona escolhida:</Text>
            <View className="flex-row flex-wrap gap-2">
              {AVAILABLE_COMPONENTS.map(comp => (
                <TouchableOpacity 
                  key={comp.id}
                  onPress={() => handleComponentAssign(comp.id)}
                  className={`px-3 py-2 rounded border flex-row items-center ${zones[activeZone] === comp.id ? 'bg-primary border-primary' : 'bg-input-background border-border'}`}
                >
                  {comp.icon && <View className="mr-2 opacity-70">{comp.icon}</View>}
                  <Text className={zones[activeZone] === comp.id ? 'text-primary-foreground font-bold text-xs' : 'text-text text-xs'}>{comp.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View className="border-t border-border pt-4 mt-2">
          <TouchableOpacity 
            className="flex-row items-center justify-between bg-surface p-4 rounded-xl border border-border"
            onPress={() => onUpdateEmbedsTech(!embedsTechnologies)}
          >
            <View className="flex-1 mr-4">
              <Text className="text-text font-bold text-sm mb-1">Incorporar Tecnologias no Perfil</Text>
              <Text className="text-text-secondary text-xs">Se ativo, e se houver tecnologias na órbita, a seção autônoma de tecnologias sumirá do menu para não haver duplicação.</Text>
            </View>
            <View className={`w-10 h-6 rounded-full p-1 justify-center ${embedsTechnologies ? 'bg-primary' : 'bg-input-background border border-border'}`}>
              <View className={`w-4 h-4 rounded-full bg-white shadow-sm ${embedsTechnologies ? 'ml-auto' : ''}`} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}
