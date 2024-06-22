import { getSubtitles } from 'youtube-caption-extractor';
import executeScript from './ChromeTabScriptExecutor';
import { MessageFromBackground } from '../../../../types/MessageType';

const getYoutubeSubtitles = async () => {
  return await executeScript(
    getVideoIdAndTitleFromUrl,
    'The videoID could not be retrieved from the address.',
    fetchSubtitlesForVideo,
  );
};

const getVideoIdAndTitleFromUrl = (): { videoId: string; title: string } => {
  const videoId = new URLSearchParams(new URL(window.location.href).search).get('v');
  if (!videoId) {
    throw new Error('No videoId found in the URL.');
  }
  const title = document.querySelector('title')?.textContent;
  //console.log(videoId, title);
  return { videoId: videoId || '', title: title || '' };
};

const fetchSubtitlesForVideo = async ({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}): Promise<MessageFromBackground> => {
  try {
    let subtitles = [];
    subtitles = await getSubtitles({ videoID: videoId, lang: 'en' });
    if (subtitles.length === 0) {
      subtitles = await getSubtitles({ videoID: videoId, lang: 'ja' });
    }
    if (subtitles.length === 0) {
      return { status: 'error', errorMessage: 'No subtitles found in en and ja.' } as MessageFromBackground;
    }
    return { status: 'success', response: concatenateSubtitles(title, subtitles) } as MessageFromBackground;
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e : new Error('Unknown error');
    return { status: 'error', errorMessage: error.message };
  }
};

const concatenateSubtitles = (title: string, subtitles: { start: string; dur: string; text: string }[]): string => {
  //console.log(subtitles);
  return 'title: ' + title + '\n\n' + subtitles.map(subtitle => subtitle.text).join('\n');
};

export default getYoutubeSubtitles;
