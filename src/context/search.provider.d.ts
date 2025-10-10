export type SearchContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type SearchProviderProps = {
  children: React.ReactNode;
};
