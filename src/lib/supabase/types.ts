/**
 * types.ts
 * Tipos do banco de dados Supabase — gerados/curados manualmente espelhando migrations
 *
 * Conecta: importado em client.ts, server.ts, admin.ts | não importa nada
 * Camada: shared (tipos de banco)
 */

/**
 * ─── Tipos do banco Supabase ───────────────────────────────────────
 *
 * Curado à mão, espelhando exatamente as migrations em
 * `supabase/migrations/`.
 *
 * Quando rodarmos `supabase gen types typescript` este arquivo
 * será sobrescrito.
 * ───────────────────────────────────────────────────────────────────
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // ─── 0004_remodel — identidade + care + vault ─────────────────
      profiles: {
        Row: {
          user_id: string
          display_name: string | null
          care_role: 'self' | 'caregiver' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          display_name?: string | null
          care_role?: 'self' | 'caregiver' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          care_role?: 'self' | 'caregiver' | null
        }
        Relationships: []
      }

      care_checklist_items: {
        Row: {
          user_id: string
          item_key: string
          done: boolean
          updated_at: string
        }
        Insert: {
          user_id: string
          item_key: string
          done?: boolean
          updated_at?: string
        }
        Update: {
          done?: boolean
          updated_at?: string
        }
        Relationships: []
      }

      vault_system_categories: {
        Row: {
          slug: string
          label: string
          icon: string | null
          color: string | null
          sort_order: number
        }
        Insert: {
          slug: string
          label: string
          icon?: string | null
          color?: string | null
          sort_order?: number
        }
        Update: {
          label?: string
          icon?: string | null
          color?: string | null
          sort_order?: number
        }
        Relationships: []
      }

      vault_categories: {
        Row: {
          id: string
          user_id: string
          slug: string
          label: string
          icon: string | null
          color: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          label: string
          icon?: string | null
          color?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          slug?: string
          label?: string
          icon?: string | null
          color?: string | null
          sort_order?: number
        }
        Relationships: []
      }

      vault_tags: {
        Row: {
          id: string
          user_id: string
          slug: string
          label: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          label: string
          created_at?: string
        }
        Update: {
          slug?: string
          label?: string
        }
        Relationships: []
      }

      vault_files: {
        Row: {
          id: string
          user_id: string
          current_blob_id: string | null
          display_name: string
          original_name: string
          system_category_slug: string | null
          user_category_id: string | null
          manual_override: boolean
          confidence: number | null
          description: string | null
          favorite: boolean
          is_private: boolean
          status: 'pending' | 'ready' | 'failed'
          text_content: string | null
          search_vector: unknown
          version_count: number
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          current_blob_id?: string | null
          display_name: string
          original_name: string
          system_category_slug?: string | null
          user_category_id?: string | null
          manual_override?: boolean
          confidence?: number | null
          description?: string | null
          favorite?: boolean
          is_private?: boolean
          status?: 'pending' | 'ready' | 'failed'
          text_content?: string | null
          version_count?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          current_blob_id?: string | null
          display_name?: string
          original_name?: string
          system_category_slug?: string | null
          user_category_id?: string | null
          manual_override?: boolean
          confidence?: number | null
          description?: string | null
          favorite?: boolean
          is_private?: boolean
          status?: 'pending' | 'ready' | 'failed'
          text_content?: string | null
          version_count?: number
          deleted_at?: string | null
        }
        Relationships: []
      }

      vault_file_blobs: {
        Row: {
          id: string
          file_id: string
          version: number
          storage_path: string
          mime_type: string
          extension: string
          size_bytes: number
          sha256: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          file_id: string
          version: number
          storage_path: string
          mime_type: string
          extension: string
          size_bytes: number
          sha256: string
          uploaded_at?: string
        }
        Update: {
          storage_path?: string
          mime_type?: string
          extension?: string
          size_bytes?: number
          sha256?: string
        }
        Relationships: []
      }

      vault_file_tags: {
        Row: {
          file_id: string
          tag_id: string
        }
        Insert: {
          file_id: string
          tag_id: string
        }
        Update: never
        Relationships: []
      }

      vault_quotas: {
        Row: {
          user_id: string
          tier: 'free' | 'premium' | 'enterprise'
          limit_bytes: number
          used_bytes: number
          file_count: number
          updated_at: string
        }
        Insert: {
          user_id: string
          tier?: 'free' | 'premium' | 'enterprise'
          limit_bytes?: number
          used_bytes?: number
          file_count?: number
          updated_at?: string
        }
        Update: {
          tier?: 'free' | 'premium' | 'enterprise'
          limit_bytes?: number
        }
        Relationships: []
      }

      vault_classifier_overrides: {
        Row: {
          id: string
          user_id: string
          pattern: string
          category_slug: string
          weight: number
          match_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pattern: string
          category_slug: string
          weight?: number
          match_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pattern?: string
          category_slug?: string
          weight?: number
          match_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'vault_classifier_overrides_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vault_classifier_overrides_category_slug_fkey'
            columns: ['category_slug']
            isOneToOne: false
            referencedRelation: 'vault_system_categories'
            referencedColumns: ['slug']
          }
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
