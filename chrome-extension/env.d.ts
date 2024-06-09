interface ImportMetaEnv {
  readonly VITE_ENV: 'development' | 'production';
  // 他の環境変数も必要に応じて追加できます
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
