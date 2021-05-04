import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import EpisodeModel from '../../model/episode';
import api from '../../services/api';
import Image from 'next/image';
import Head from 'next/head';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';
import { usePlayer } from '../../contexts/playerContext';

export default function Episode(episode: EpisodeModel) {
	const { play } = usePlayer();

	return (
		<div className={styles.episode}>
			<Head>
				<title>{episode.title} | Podcastr</title>
			</Head>
			<div className={styles.thumbnailContainer}>
				<Link href='/'>
					<button type='button'>
						<img src='/arrow-left.svg' alt='Voltar'></img>
					</button>
				</Link>
				<Image
					width={700}
					height={160}
					src={episode.thumbnail}
					objectFit='cover'
				/>
				<button type='button'>
					<img
						src='/play.svg'
						alt='Tocar episódio'
						onClick={() => play(episode)}
					></img>
				</button>
			</div>

			<header>
				<h1>{episode.title}</h1>
				<span>{episode.members}</span>
				<span>{episode.publishedAt}</span>
				<span>{episode.durationAsString}</span>
			</header>

			<div
				className={styles.description}
				dangerouslySetInnerHTML={{ __html: episode.description }}
			/>
		</div>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async (ctx) => {
	const { slug } = ctx.params;

	const { data } = await api.get(`/episodes/${slug}`);

	const episode = {
		id: data.id,
		title: data.title,
		members: data.members,
		publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
			locale: ptBR,
		}),
		duration: data.file.duration,
		durationAsString: convertDurationToTimeString(data.file.duration),
		description: data.description,
		url: data.file.url,
		thumbnail: data.thumbnail,
	};

	return {
		props: episode,
		revalidate: 60 * 60 * 24, // 24 hours
	};
};
