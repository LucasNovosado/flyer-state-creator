
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Store } from '@/types/store';
import { toast } from '@/hooks/use-toast';

export const useStores = () => {
  const queryClient = useQueryClient();

  const { data: stores = [], isLoading, error } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      console.log('Fetching stores from Supabase...');
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('estado', { ascending: true })
        .order('cidade', { ascending: true });

      if (error) {
        console.error('Error fetching stores:', error);
        throw error;
      }

      console.log('Stores fetched successfully:', data?.length);
      return data as Store[];
    },
  });

  const createStoreMutation = useMutation({
    mutationFn: async (newStore: Omit<Store, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating store:', newStore);
      const { data, error } = await supabase
        .from('stores')
        .insert([newStore])
        .select()
        .single();

      if (error) {
        console.error('Error creating store:', error);
        throw error;
      }

      console.log('Store created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast({
        title: "Loja adicionada!",
        description: "A loja foi adicionada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error in createStoreMutation:', error);
      toast({
        title: "Erro ao adicionar loja",
        description: "Ocorreu um erro ao adicionar a loja. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateStoreMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Store> & { id: string }) => {
      console.log('Updating store:', id, updateData);
      const { data, error } = await supabase
        .from('stores')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating store:', error);
        throw error;
      }

      console.log('Store updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast({
        title: "Loja atualizada!",
        description: "A loja foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error in updateStoreMutation:', error);
      toast({
        title: "Erro ao atualizar loja",
        description: "Ocorreu um erro ao atualizar a loja. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteStoreMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting store:', id);
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting store:', error);
        throw error;
      }

      console.log('Store deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast({
        title: "Loja removida!",
        description: "A loja foi removida com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error in deleteStoreMutation:', error);
      toast({
        title: "Erro ao remover loja",
        description: "Ocorreu um erro ao remover a loja. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    stores,
    isLoading,
    error,
    createStore: createStoreMutation.mutate,
    updateStore: updateStoreMutation.mutate,
    deleteStore: deleteStoreMutation.mutate,
    isCreating: createStoreMutation.isPending,
    isUpdating: updateStoreMutation.isPending,
    isDeleting: deleteStoreMutation.isPending,
  };
};
