import Link from 'next/link';

export const ListNotFound = () => (
  <main>
    <h1 className="mb-4">Liste nicht gefunden</h1>
    <p className="spaced">¯\_(ツ)_/¯</p>
    <p className="spaced">
      <Link href="/lists" className="underline text-primary-100 hover:text-primary-150">
        Alle Listen
      </Link>
    </p>
  </main>
);

export default ListNotFound;
