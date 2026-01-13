export interface BaseEntity {
  id: string | number;
  [key: string]: any;
}

export interface TypeAheadProps<T extends BaseEntity> {
  value?: T | null;
  onChange: (value: T | null) => void;
  onSearch: (query: string) => Promise<T[]>;
  displayField: keyof T;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  onCreate?: () => void;
  onEdit?: (item: T) => void;
  onView?: (item: T) => void;
  required?: boolean;
  className?: string;
}
