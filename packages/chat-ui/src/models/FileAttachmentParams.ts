export type FileAttachmentParams = {
  file: File;
  params: {
    setProgress: (n: number) => void;
    onFinish: () => void;
  },
}
