import { readdir } from 'node:fs/promises';
import { FC } from 'react';

const getIconsFromFiles = async () => {
  try {
    return (await readdir('src/elements/icons/'))
      .map((filename) => require(`../../elements/icons/${filename}`))
      .map((icon) => {
        const [name, Icon] = Object.entries(icon)[0];
        return { name, Icon: Icon as JSX.ElementType };
      });
  } catch (error) {
    return [];
  }
};

const Page = async () => {
  const icons = await getIconsFromFiles();
  const editIcons = icons.filter(({ name }) => name.startsWith('IconItemEdit'));
  const nonEditIcons = icons.filter(({ name }) => !name.startsWith('IconItemEdit'));

  return (
    <>
      <IconGrid icons={nonEditIcons} />
      <h1 className="text-md font-massive text-black mt-12 mb-4">EditIcons</h1>
      <div className="mb-2">ItemEdit…</div>
      <IconGrid icons={editIcons} />
    </>
  );
};

const IconGrid: FC<{ icons: Awaited<ReturnType<typeof getIconsFromFiles>> }> = ({ icons }) => (
  <ul className="flex flex-wrap gap-4">
    {icons.map(({ name, Icon }) => (
      <li key={name} className="flex flex-col gap-0.5 text-[12px] items-center">
        <Icon className="w-16 h-16 text-black border border-gray-75" />
        <span className="w-16">
          <span className="w-24 -left-4 relative text-center block">
            {name.replace('Icon', '').replace('ItemEdit', '')}
          </span>
        </span>
      </li>
    ))}
  </ul>
);

export default Page;
