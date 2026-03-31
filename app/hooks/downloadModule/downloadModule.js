const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to download files',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
};

const downloadMP3 = async (data) => {
  const url = data.url;
  const fileName = `${data.name}.mp3`

  const hasPermission = await requestStoragePermission();
  if (!hasPermission) {
    console.error('Storage permission denied');
    return;
  }

  const downloadFolder = `${RNFS.DownloadDirectoryPath}/MyMusicApp`;
  const downloadDest = `${downloadFolder}/${fileName}`;

  // Create the folder if it doesn't exist
  try {
    const folderExists = await RNFS.exists(downloadFolder);
    if (!folderExists) {
      await RNFS.mkdir(downloadFolder);
      console.log('Folder created:', downloadFolder);
    }
  } catch (err) {
    console.error('Error creating folder:', err);
    return;
  }

  setIsLoading(true);

  RNFS.downloadFile({
    fromUrl: url,
    toFile: downloadDest,
  })
    .promise.then(res => {
      console.log('File downloaded successfully:', res);
      console.log('File saved to:', downloadDest);
      setIsLoading(false);
      // Trigger media scanner
      if (Platform.OS === 'android') {
        RNFS.scanFile(downloadDest).then(() => {
          console.log('Scan complete');
        }).catch(scanErr => {
          console.error('Scan error:', scanErr);
        });
      }
    })
    .catch(err => {
      console.error('File download error:', err);
      setIsLoading(false);
    });
};