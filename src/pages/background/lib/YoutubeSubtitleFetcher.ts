import { getSubtitles } from 'youtube-captions-scraper';
import executeScript from './ChromeTabScriptExecutor';

const getYoutubeSubtitles = sendResponse => {
  executeScript(
    sendResponse,
    getVideoIdFromUrl,
    'YoutubeアドレスからvideoIDを取り出せませんでした。',
    async (result, sendResponse) => {
      try {
        const subtitles = await getSubtitles({ videoID: result, lang: 'en' });
        const concatenatedSubtitles = concatenateSubtitles(subtitles);
        sendResponse({ status: 'success', response: concatenatedSubtitles });
      } catch (e) {
        console.error(e);
        sendResponse({ status: 'error', errorMessage: e.message });
      }
    },
  );
};

const getVideoIdFromUrl = () => {
  const url = window.location.href;
  console.log(url);
  return new URLSearchParams(new URL(url).search).get('v');
};

const concatenateSubtitles = (subtitles: { text: string }[]): string => {
  return subtitles.map(subtitle => subtitle.text).join('\n');
};

export default getYoutubeSubtitles;
