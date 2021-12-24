import React, { FC } from 'react';
import styled from 'styled-components';
import { version } from '../../../package.json';
import { Header } from '../components/header';
import { Main } from '../components/main';
import { Menu } from '../components/menu';
import { ExtLink } from '../elements/link';
import { Heading, Paragraph } from '../elements/typography';
import { PageLayout } from '../layout/page-layout';

export const About: FC = () => (
  <>
    <Header />
    <Menu />
    <Main>
      <PageLayout>
        <Heading>Die Idee: inemit statt Bullshit.</Heading>
        <ExplainerParagraph big>
          Die <Highlight color="yellow">beste Methode</Highlight> für{' '}
          <Highlight color="green">effizientes Lernen</Highlight> als{' '}
          <Highlight color="orange">moderne App</Highlight>.
        </ExplainerParagraph>
        <ExplainerParagraph>
          <Highlight color="yellow">Yay science!</Highlight> Analoge Lernkarteien machen
          sich den Effekt schon lange zunutze und die Lernforschung hat ihn bestätigt:{' '}
          <Highlight color="yellow">Wiederholung</Highlight> ist zentral, um Vokabeln zu
          lernen. Ich wiederhole: Wiederholung. Wiederholung? Genau, Wiederholung.{' '}
          <ExtLink href="https://de.wikipedia.org/wiki/Spaced_repetition">
            Spaced repetition
          </ExtLink>{' '}
          ist die raffinierte Version davon.
        </ExplainerParagraph>
        <ExplainerParagraph>
          <Highlight color="orange">Eine App</Highlight> nicht deswegen, weil digital =
          toll, sondern weil digital = ideale Voraussetzung für{' '}
          <Highlight color="orange">systematisches Lernen</Highlight>. Die App kümmert
          sich darum, dass gut verankerte Vokabeln seltener abgefragt werden – und falsch
          beantwortete häufiger (
          <ExtLink href="https://supermemo.guru/wiki/SuperMemo_1.0_for_DOS_(1987)#Algorithm_SM-2">
            <em>SM-2</em>-Algorithmus
          </ExtLink>
          ). Sie berechnet den <Highlight color="orange">optimalen Zeitabstand</Highlight>{' '}
          bis zur nächsten Abfrage und garantiert so, dass du deine Lernzeit effizient
          nutzt.
        </ExplainerParagraph>
        <ExplainerParagraph>
          <Inemit>Inemit</Inemit> stellt die Basis für{' '}
          <Highlight color="green">sinnvolles Lernen</Highlight> bereit. Lernen musst du
          selbst. Und die Lerninhalte machst du am besten auch selbst. Denn neben
          regelmässiger Wiederholung sind{' '}
          <Highlight color="green">passende Lerninhalte</Highlight> entscheidend (vgl.{' '}
          <ExtLink href="https://universeofmemory.com/spaced-repetition-apps-dont-work/">
            Why Most Spaced Repetition Apps Don't Work
          </ExtLink>
          ).
        </ExplainerParagraph>
        <TechnicalNotes>
          Version: {version} •{' '}
          <ExtLink href="https://github.com/kimbylr/inemit/blob/master/CHANGELOG.md">
            Changelog
          </ExtLink>{' '}
          •{' '}
          <ExtLink href="https://github.com/kimbylr/inemit/">
            Quellcode auf Github
          </ExtLink>
        </TechnicalNotes>
        <Separator />

        <TechnicalNotes>
          <strong>Datenschutz</strong>: <Inemit>Inemit</Inemit> ist ein Hobby-Projekt von{' '}
          <ExtLink href="https://bylr.ch">mir</ExtLink>. Die Daten, die du eingibst,
          müssen gespeichert werden, damit die App funktioniert. Und fürs Login braucht's
          ein Cookie. Du wirst nicht getrackt und deine Daten werden vertraulich
          behandelt.
          <List>
            <li>
              Deine Logindaten (Mail & Passwort) verwaltet Auth0. Das ist sicherer, als
              Userdaten eigenhändig zu verwalten.
            </li>
            <li>
              Deine Lernlisten liegen bei MongoDB Atlas. Wenn du eine Liste löschst, wird
              sie aus der Datenbank entfernt.
            </li>
          </List>
          <strong>Kontakt</strong>: Um deinen Account zu löschen (und für weitere
          Anliegen), wende dich an{' '}
          <ExtLink href="mailto:kontakt@inem.it">kontakt@inem.it</ExtLink>.{' '}
        </TechnicalNotes>
      </PageLayout>
    </Main>
  </>
);

const ExplainerParagraph = styled(Paragraph)<{ big?: boolean }>`
  font-size: ${({ big, theme: { font } }) => font.sizes[big ? 'md' : 'sm']};
`;

const Highlight = styled.strong<{ color: 'orange' | 'yellow' | 'green' }>`
  background: ${({ color, theme: { colors } }) =>
    color === 'green' ? colors.secondary[20] : colors[color][20]};
`;

const Inemit = styled.strong`
  font-weight: ${({ theme: { font } }) => font.weights.massive} !important;
  color: ${({ theme: { colors } }) => colors.primary[150]} !important;
`;

const TechnicalNotes = styled(Paragraph)`
  margin-top: 2.5rem;
  font-size: ${({ theme: { font } }) => font.sizes.xs};
`;

const Separator = styled.hr`
  margin: 2.5rem 0;
  border: none;
  height: 1px;
  background: ${({ theme: { colors } }) => colors.grey[75]};
`;

const List = styled.ul`
  margin-top: 0;
  li {
    margin-top: 0.5rem;
  }
`;
