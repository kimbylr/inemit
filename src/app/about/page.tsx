import { AnchorHTMLAttributes, FC, ReactNode } from 'react';
import { version } from '../../../package.json';

const AboutPage = () => (
  <>
    <h1>Die Idee: inemit statt Bullshit.</h1>
    <p className="spaced">
      Die <Highlight color="yellow">beste Methode</Highlight> für{' '}
      <Highlight color="green">effizientes Lernen</Highlight> als{' '}
      <Highlight color="orange">moderne App</Highlight>.
    </p>

    <h3 className="text-yellow-150 flex items-center mt-8">
      <CircledNumber className="bg-yellow-150">1</CircledNumber>
      Hat Methode
    </h3>
    <p className="mt-2">
      <strong>Yay science!</strong> Analoge Lernkarteien machen sich den Effekt schon lange zunutze
      und die Lernforschung hat ihn bestätigt: <Highlight color="yellow">Wiederholung</Highlight>{' '}
      ist zentral, um Vokabeln zu lernen. Ich wiederhole: Wiederholung. Wiederholung? Genau,
      Wiederholung.{' '}
      <ExtLink href="https://de.wikipedia.org/wiki/Spaced_repetition">Spaced repetition</ExtLink>{' '}
      ist die raffinierte Version davon.
    </p>

    <h3 className="text-orange-150 flex items-center mt-8">
      <CircledNumber className="bg-orange-150">2</CircledNumber>
      Computer says yes
    </h3>
    <p className="mt-2">
      Eine App nicht (nur), weil digital = toll, sondern weil digital = ideale Voraussetzung für{' '}
      <Highlight color="orange">systematisches Lernen</Highlight>. Die App kümmert sich darum, dass
      gut verankerte Vokabeln seltener abgefragt werden – und falsch beantwortete häufiger (
      <ExtLink href="https://supermemo.guru/wiki/SuperMemo_1.0_for_DOS_(1987)#Algorithm_SM-2">
        <em>SM-2</em>-Algorithmus
      </ExtLink>
      ). Sie berechnet den <Highlight color="orange">optimalen Zeitabstand</Highlight> bis zur
      nächsten Abfrage und garantiert so, dass du deine Lernzeit effizient nutzt.
    </p>

    <h3 className="text-secondary-150 flex items-center mt-8">
      <CircledNumber className="bg-secondary-150">3</CircledNumber>
      Ohne Schnickschnack
    </h3>
    <p className="mt-2">
      <Inemit>Inemit</Inemit> stellt die Basis für{' '}
      <Highlight color="green">sinnvolles Lernen</Highlight> bereit. Lernen musst du selbst. Und die
      Lerninhalte machst du am besten auch selbst. Denn neben regelmässiger Wiederholung sind{' '}
      <Highlight color="green">passende Lerninhalte</Highlight> entscheidend (vgl.{' '}
      <ExtLink href="https://universeofmemory.com/spaced-repetition-apps-dont-work/">
        Why Most Spaced Repetition Apps Don&apos;t Work
      </ExtLink>
      ).
    </p>

    <hr className="my-12" />

    <p className="spaced text-xs">
      <strong>Version</strong>: {version} •{' '}
      <ExtLink href="https://github.com/kimbylr/inemit/blob/main/CHANGELOG.md">Changelog</ExtLink> •{' '}
      <ExtLink href="https://github.com/kimbylr/inemit/">Quellcode auf Github</ExtLink>
    </p>
    <p className="spaced text-xs !mb-0">
      <strong>Datenschutz</strong>: <Inemit>Inemit</Inemit> ist ein Hobby-Projekt von{' '}
      <ExtLink href="https://bylr.ch">mir</ExtLink>. Die Daten, die du eingibst, müssen gespeichert
      werden, damit die App funktioniert. Und fürs Login braucht&apos;s ein Cookie. Du wirst nicht
      getrackt und deine Daten werden vertraulich behandelt.
    </p>
    <ul className="actual-list">
      <li>
        Deine Logindaten (Mail & Passwort) verwaltet Auth0. Das ist sicherer, als Userdaten
        eigenhändig zu verwalten.
      </li>
      <li>
        Deine Lernlisten liegen bei MongoDB Atlas. Wenn du eine Liste löschst, wird sie aus der
        Datenbank entfernt.
      </li>
    </ul>
    <p className="spaced text-xs">
      <strong>Kontakt</strong>: Um deinen Account zu löschen (und für weitere Anliegen), wende dich
      an <ExtLink href="mailto:kontakt@inem.it">kontakt@inem.it</ExtLink>.{' '}
    </p>
  </>
);

const CircledNumber: FC<{ className: string; children: ReactNode }> = ({ className, children }) => (
  <span
    className={`inline-flex justify-center items-center rounded-full w-7 h-7 mr-2 font-bold text-gray-98 text-xs+ ${className}`}
  >
    {children}
  </span>
);

const Highlight: FC<{ color: 'orange' | 'yellow' | 'green'; children: ReactNode }> = ({
  color,
  children,
}) => (
  <strong
    className={
      color === 'green' ? 'bg-secondary-20' : color === 'yellow' ? 'bg-yellow-50' : 'bg-orange-20'
    }
  >
    {children}
  </strong>
);

const Inemit: FC<{ children: ReactNode }> = ({ children }) => (
  <span className="font-massive text-primary-150">{children}</span>
);

const ExtLink: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => (
  <a className="text-primary-100 underline hover:text-primary-150" {...props} />
);

export default AboutPage;
