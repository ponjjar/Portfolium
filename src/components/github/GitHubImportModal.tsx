import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Modal } from '@/components/ui/modal';
import { GitHubNotFoundError, normalizeGitHubUsername } from '@/services/github/github-client';
import { fetchAllPublicRepositories, fetchGitHubUser } from '@/services/github/github-repositories';
import { GitHubRepositorySummary } from '@/services/github/github.schemas';
import { usePortfolioStore } from '@/store';
import { AlertCircle, CheckCircle2, Circle, Code2, Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface GitHubImportModalProps {
  visible: boolean;
  onClose: () => void;
  onImport: (repos: GitHubRepositorySummary[]) => void;
}

export function GitHubImportModal({ visible, onClose, onImport }: GitHubImportModalProps) {
  const existingProjects = usePortfolioStore((s) => s.session.projects);
  const [step, setStep] = useState<'input' | 'loading' | 'select'>('input');

  const [usernameInput, setUsernameInput] = useState('');
  const [repositories, setRepositories] = useState<GitHubRepositorySummary[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'sources' | 'forks' | 'archived'>('all');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep('input');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsernameInput('');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRepositories([]);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedIds(new Set());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchQuery('');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilter('all');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(null);
    }
  }, [visible]);

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
    const toImport = repositories.filter(r => selectedIds.has(r.id));
    onImport(toImport);
  };

  const handleFetch = handleSearch;

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredRepos.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRepos.map(r => r.id)));
    }
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const filteredRepos = repositories.filter(repo => {
    if (searchQuery && !repo.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filter === 'sources' && repo.isFork) return false;
    if (filter === 'forks' && !repo.isFork) return false;
    if (filter === 'archived' && !repo.isArchived) return false;
    return true;
  });

  return (
    <Modal visible={visible} onClose={onClose} title="Importar projetos do GitHub" size="lg">
      <View className="flex-1 h-[600px] bg-background">
        {step === 'input' && (
          <View className="flex-1 p-6 justify-center">
            <View className="mb-6 items-center">
              <Code2 color="var(--text)" size={48} className="mb-4" />
              <Text className="text-text font-bold text-xl mb-2 text-center">Informe seu usuário para escolher quais repositórios deseja adicionar.</Text>
              <Text className="text-text-secondary text-center"></Text>
            </View>

            <FormField
              label="Username ou URL do perfil"
              placeholder="ex: github.com/seu-usuario ou apenas 'seu-usuario'"
              value={usernameInput}
              onChangeText={setUsernameInput}
              onSubmitEditing={handleFetch}
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

            <Button onPress={handleFetch} disabled={!usernameInput.trim()}>
              <Text className="text-primary-foreground font-bold">Buscar repositórios</Text>
            </Button>
          </View>
        )}

        {step === 'loading' && (
          <View className="flex-1 p-6 items-center justify-center">
            <ActivityIndicator size="large" color="var(--text)" className="mb-4" />
            <Text className="text-text text-lg font-bold">Buscando repositórios...</Text>
            <Text className="text-text-secondary mt-2"></Text>
          </View>
        )}

        {step === 'select' && (
          <View className="flex-1">
            <View className="p-4 bg-surface-elevated border-b border-border">
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

            <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
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

            <ScrollView className="flex-1 p-4">
              {filteredRepos.length === 0 ? (
                <View className="py-10 items-center justify-center">
                  <Text className="text-text-secondary text-center">No repositories found matching your filters.</Text>
                </View>
              ) : (
                filteredRepos.map(repo => {
                  const isSelected = selectedIds.has(repo.id);
                  const isAlreadyImported = existingProjects.some(
                    p => p.source.type === 'github' && p.source.repository.url === repo.htmlUrl
                  );

                  return (
                    <TouchableOpacity
                      key={repo.id}
                      disabled={isAlreadyImported}
                      onPress={() => toggleSelect(repo.id)}
                      className={`flex-row items-start p-4 mb-3 rounded border ${isSelected ? 'border-primary bg-primary/10' : 'border-border bg-surface'
                        } ${isAlreadyImported ? 'opacity-50' : ''}`}
                    >
                      <View className="mr-3 mt-1">
                        {isSelected ? (
                          <CheckCircle2 color="#10b981" size={20} />
                        ) : (
                          <Circle color="#666" size={20} />
                        )}
                      </View>

                      <View className="flex-1">
                        <View className="flex-row items-center flex-wrap mb-1">
                          <Text className="text-text font-bold text-lg mr-2">{repo.name}</Text>
                          {isAlreadyImported && (
                            <View className="bg-green-500/20 px-2 py-0.5 rounded mr-2">
                              <Text className="text-green-500 text-[10px] font-bold">IMPORTED</Text>
                            </View>
                          )}
                          {repo.isFork && (
                            <View className="bg-surface-elevated px-2 py-0.5 rounded mr-2">
                              <Text className="text-text-secondary text-[10px] font-bold">FORK</Text>
                            </View>
                          )}
                          {repo.isArchived && (
                            <View className="bg-yellow-500/20 px-2 py-0.5 rounded mr-2">
                              <Text className="text-yellow-500 text-[10px] font-bold">ARCHIVED</Text>
                            </View>
                          )}
                        </View>

                        {repo.description ? (
                          <Text className="text-text-secondary text-sm mb-2" numberOfLines={2}>
                            {repo.description}
                          </Text>
                        ) : null}

                        <View className="flex-row items-center mt-2 flex-wrap gap-x-3 gap-y-1">
                          {repo.language && (
                            <Text className="text-xs text-blue-400">{repo.language}</Text>
                          )}
                          <Text className="text-xs text-text-secondary">★ {repo.stars}</Text>
                          <Text className="text-xs text-text-secondary">
                            Updated {new Date(repo.updatedAt).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
              <View className="h-20" />
            </ScrollView>

            {/* Footer */}
            <View className="p-4 border-t border-border bg-surface-elevated flex-row items-center justify-between">
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
          </View>
        )}

      </View>
    </Modal>
  );
}
