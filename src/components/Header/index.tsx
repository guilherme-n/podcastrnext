import format from 'date-fns/format';
import ptBr from 'date-fns/locale/pt-BR';

import styles from './styles.module.scss';

export default function Header() {
	const currentDate = format(new Date(), "EEEEEE, d ' de 'MMMM", {
		locale: ptBr,
	});

	return (
		<header className={styles.headerContainer}>
			<img src='/logo.svg' alt='Podcastr' />
			<p>O melhor para você ouvir. Sempre.</p>
			<span>{currentDate}</span>
		</header>
	);
}
