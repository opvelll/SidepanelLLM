import { getSubtitles } from 'youtube-caption-extractor';
import executeScript from './ChromeTabScriptExecutor';
import { ReceivedMessage } from '../../../../types/MessageType';

const getYoutubeSubtitles = async () => {
  return await executeScript(
    getVideoIdAndTitleFromUrl,
    'YoutubeアドレスからvideoIDを取り出せませんでした。',
    async ({ videoId, title }) => {
      try {
        let subtitles = [];
        subtitles = await getSubtitles({ videoID: videoId, lang: 'en' });
        if (subtitles.length === 0) {
          subtitles = await getSubtitles({ videoID: videoId, lang: 'ja' });
        }
        if (subtitles.length === 0) {
          return { status: 'error', errorMessage: 'No subtitles found in en and ja.' } as ReceivedMessage;
        }
        const concatenatedSubtitles = concatenateSubtitles(title, subtitles);
        return { status: 'success', response: concatenatedSubtitles } as ReceivedMessage;
      } catch (e) {
        console.error(e);
        const error = e instanceof Error ? e : new Error('Unknown error');
        return { status: 'error', errorMessage: error.message };
      }
    },
  );
};

const getVideoIdAndTitleFromUrl = (): { videoId: string; title: string } => {
  const videoId = new URLSearchParams(new URL(window.location.href).search).get('v');
  const title = document.querySelector('title')?.textContent;
  console.log(videoId, title);
  return { videoId: videoId || '', title: title || '' };
};

const concatenateSubtitles = (title: string, subtitles: { start: string; dur: string; text: string }[]): string => {
  console.log(subtitles);
  return 'title: ' + title + '\n\n' + subtitles.map(subtitle => subtitle.text).join('\n');
};

export default getYoutubeSubtitles;
