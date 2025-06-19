export const formatFileSize = (bytes: number): string => {
  const mb = bytes / 1024 ** 2;
  const gb = bytes / 1024 ** 3;

  if (gb >= 0.01) {
    return gb.toFixed(2) + " GB";
  } else {
    return mb.toFixed(2) + " MB";
  }
};
