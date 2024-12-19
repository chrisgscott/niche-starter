'use client';

import { generateSchemaMarkup } from '@/utils/schema';
import { Schema } from '@/types/schema';

interface SchemaComponentProps {
  data: Schema;
}

export function SchemaComponent({ data }: SchemaComponentProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateSchemaMarkup(data))
      }}
    />
  );
}
