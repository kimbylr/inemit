import { ListProgress } from '@/components/list-progress';
import { Button } from '@/elements/button';
import { Checkbox } from '@/elements/checkbox';
import { Hint } from '@/elements/hint';
import { RadioButton } from '@/elements/radio-button';
import { Spinner } from '@/elements/spinner';
import { Switch } from '@/elements/switch';
import { TextField } from '@/elements/text-field';
import { Textarea } from '@/elements/textarea';
import { auth0 } from '@/services/auth0';
import { redirect } from 'next/navigation';
import { FC, ReactNode } from 'react';
import Icons from './icons';

const Page = async () => {
  const session = await auth0.getSession();
  if (!session) {
    redirect('/auth/login');
  }

  return (
    <>
      <h1 className="text-gray-25">UI Elements</h1>
      <Section title="Buttons">
        <Button primary>primary button</Button>
        <Button>button</Button>
        <Button caution>caution button</Button>
        <Button small>small button</Button>
      </Section>
      <Section title="Text Field">
        <div>
          <TextField placeholder="default" />
        </div>
        <TextField label="label" placeholder="default" />
        <div>
          <TextField small placeholder="small" />
        </div>
        <TextField small label="label" placeholder="small" />
      </Section>
      <Section title="Textarea">
        <Textarea placeholder="Write me a letter" />
      </Section>

      <Section title="Radio Button">
        <RadioButton checked name="test" onCheck={undefined as any}>
          Option 1
        </RadioButton>
        <RadioButton checked={false} name="test" onCheck={undefined as any}>
          Option 2
        </RadioButton>
      </Section>
      <Section title="Checkbox">
        <Checkbox checked onCheck={undefined as any}>
          Option 1
        </Checkbox>
        <Checkbox checked={false} onCheck={undefined as any}>
          Option 2
        </Checkbox>
      </Section>
      <Section title="Switch">
        <Switch onToggle={undefined as any} enabled />
        <Switch onToggle={undefined as any} enabled={false} />
      </Section>

      <Section title="Hint">
        <div className="mt-24 w-40 relative h-10 border border-gray-25 rounded flex items-center justify-center">
          Basis
          <Hint onDismiss={undefined as any}>Ein kleiner Hinweis</Hint>
        </div>
        <div className="mt-24 w-40 relative h-10 border border-gray-25 rounded flex items-center justify-center">
          Basis
          <Hint onDismiss={undefined as any} triangle>
            triangle
          </Hint>
        </div>
      </Section>
      <Section title="Spinner">
        <Spinner />
      </Section>

      <h1 className="text-gray-25  mt-20 mb-6">UI Components</h1>
      <Section title="Progress Bar">
        <ListProgress
          stages={{ 1: 23, 2: 34, 3: 45, 4: 56 }}
          modes={['legend', 'count', 'percentage']}
        />
        <ListProgress stages={{ 1: 23, 2: 34, 3: 45, 4: 56 }} modes={['count', 'percentage']} />
      </Section>

      <h1 className="text-gray-25 mt-20 mb-6">Icons</h1>
      <Icons />
    </>
  );
};

const Section: FC<{ title: string; children: ReactNode | ReactNode[] }> = ({ title, children }) => (
  <section className="flex gap-4 mt-12 mb-4 items-center">
    <h2 className="text-sm font-bold text-gray-25 w-48 grow-0 shrink-0">{title}</h2>
    <div className="flex gap-4 flex-wrap items-start">{children}</div>
  </section>
);

export default Page;
