from pytube import YouTube

def download_video(url, download_path='.', resolution='highest'):
    try:
        # Create a YouTube object with the URL
        yt = YouTube(url)
        
        # Select the stream based on resolution
        if resolution == 'highest':
            stream = yt.streams.get_highest_resolution()
        elif resolution == 'lowest':
            stream = yt.streams.get_lowest_resolution()
        else:
            # For specific resolution, you may need to select the appropriate stream
            stream = yt.streams.filter(res=resolution).first()
            if not stream:
                print(f"No stream found for resolution {resolution}.")
                return
        
        # Download the video
        print(f"Downloading video '{yt.title}'...")
        stream.download(output_path=download_path)
        print(f"Video downloaded successfully and saved to {download_path}")

    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage
video_url = 'https://www.youtube.com/watch?v=your_video_id'
download_video(video_url, download_path='path/to/download/directory', resolution='720p')
