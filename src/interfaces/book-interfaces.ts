interface Book {
  id: string;
  code_book: string;
  title: string;
  image: string;
  author: string;
  stock: number;
  description: string;
  created_by: string;
  updated_by: string | null;
  deleted_by: null;
  restored_by: null;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export { Book };
