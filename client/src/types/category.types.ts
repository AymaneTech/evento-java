export interface CategoryResponseDto {
  id: number;
  name: string;
  description: string;
  slug: string;
}

export interface CategoryRequestDto {
  name: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
}

