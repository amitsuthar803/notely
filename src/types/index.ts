export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
}

export type RootStackParamList = {
  Home: undefined;
  EditNote: { note?: any } | undefined;
  Settings: undefined;
  Todo: undefined;
  Profile: undefined;
};
