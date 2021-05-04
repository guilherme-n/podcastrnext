import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
	title: string;
	members: string;
	thumbnail: string;
	duration: number;
	url: string;
};

type PlayerContextData = {
	episodeList: Episode[];
	currentEpisodeIndex: number;
	isPlaying: boolean;
	isLooping: boolean;
	isShuffling: boolean;
	play: (episode: Episode) => void;
	playList: (episodes: Episode[], index: number) => void;
	playNext: () => void;
	playPrevious: () => void;
	setPlayingState: (state: boolean) => void;
	togglePlay: () => void;
	toggleLoop: () => void;
	toggleShuffle: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
	children: ReactNode;
};

export function PlayerContextProvider(props: PlayerContextProviderProps) {
	const [episodeList, setEpisodeList] = useState([]);
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLooping, setIsLooping] = useState(false);
	const [isShuffling, setIsShuffling] = useState(false);

	function play(episode: Episode) {
		setEpisodeList([episode]);
		setCurrentEpisodeIndex(0);
		setIsPlaying(true);
	}

	function playList(episodes: Episode[], index: number) {
		setEpisodeList(episodes);
		setCurrentEpisodeIndex(index);
		setIsPlaying(true);
	}

	function playNext() {
		const nextEpisodeIndex = currentEpisodeIndex + 1;

		if (isLooping) {
			setCurrentEpisodeIndex(currentEpisodeIndex);
		} else if (isShuffling) {
			let nextRandomEpisodeIndex = currentEpisodeIndex;

			while (currentEpisodeIndex === nextRandomEpisodeIndex) {
				nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
			}
			setCurrentEpisodeIndex(nextRandomEpisodeIndex);
		} else if (nextEpisodeIndex < episodeList.length) {
			setCurrentEpisodeIndex(nextEpisodeIndex);
		}
	}

	function playPrevious() {
		if (currentEpisodeIndex > 0) {
			setCurrentEpisodeIndex(currentEpisodeIndex - 1);
		}
	}

	function togglePlay() {
		setIsPlaying(!isPlaying);
	}

	function toggleLoop() {
		setIsLooping(!isLooping);
	}

	function toggleShuffle() {
		setIsShuffling(!isShuffling);
	}

	function setPlayingState(state: boolean) {
		setIsPlaying(state);
	}

	return (
		<PlayerContext.Provider
			value={{
				episodeList,
				currentEpisodeIndex,
				isPlaying,
				isLooping,
				isShuffling,
				play,
				playList,
				playNext,
				playPrevious,
				togglePlay,
				toggleLoop,
				toggleShuffle,
				setPlayingState,
			}}
		>
			{props.children}
		</PlayerContext.Provider>
	);
}

export const usePlayer = () => useContext(PlayerContext);
