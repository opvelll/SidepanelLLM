import { getSubtitles } from 'youtube-captions-scraper';
import executeScript from './ChromeTabScriptExecutor';
import { ReceivedMessage } from '../../sidepanel/lib/MessageType';

const getYoutubeSubtitles = async () => {
  return await executeScript(getVideoIdFromUrl, 'YoutubeアドレスからvideoIDを取り出せませんでした。', async result => {
    try {
      const subtitles = await getSubtitles({ videoID: result, lang: 'en' });
      const concatenatedSubtitles = concatenateSubtitles(subtitles);
      return { status: 'success', response: concatenatedSubtitles } as ReceivedMessage;
    } catch (e) {
      console.error(e);
      return { status: 'error', errorMessage: e.message };
    }
  });
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
