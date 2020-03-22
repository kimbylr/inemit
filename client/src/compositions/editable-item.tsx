import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { EditStatus } from '../components/edit-status';
import { Icon } from '../elements/icon';
import { Input } from '../elements/input';
import { Label } from '../elements/label';
import { editItem } from '../helpers/api';
import { BaseLearnItem, LearnItem } from '../models';

interface Props {
  listId: string;
  index: number;
  item: LearnItem;
}

export const EditableItem: FC<Props> = ({ listId, index, item }) => {
  const [savedItem, setSavedItem] = useState<BaseLearnItem>({
    prompt: item.prompt,
    solution: item.solution,
  });
  const [currentItem, setCurrentItem] = useState<BaseLearnItem>({
    prompt: item.prompt,
    solution: item.solution,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const onChangePrompt = (value: string) => {
    setCurrentItem(item => ({ ...item, prompt: value }));
  };
  const onChangeSolution = (value: string) => {
    setCurrentItem(item => ({ ...item, solution: value }));
  };

  const saved =
    currentItem.prompt === savedItem.prompt &&
    currentItem.solution === savedItem.solution;

  const submit = async (event: React.MouseEvent | React.FocusEvent) => {
    event.preventDefault();

    if (!currentItem.prompt || !currentItem.solution || saved) {
      return;
    }

    setSaving(true);
    setError(false);

    try {
      const { prompt, solution } = await editItem({
        listId,
        itemId: item.id,
        item: { prompt: currentItem.prompt, solution: currentItem.solution },
      });
      setSavedItem({ prompt, solution }); // TODO: propagate to store
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <MetaColumn>
        <Index>{index}</Index>
        <Delete>
          <Icon type="delete" />
        </Delete>
      </MetaColumn>

      <InputsColumn>
        <LabelWithSpacing>
          <Input
            onBlur={submit}
            value={currentItem.solution}
            placeholder={savedItem.solution}
            onChange={e => onChangeSolution(e.target.value)}
          />
          Vokabel
        </LabelWithSpacing>
        <LabelWithSpacing>
          <Input
            onBlur={submit}
            value={currentItem.prompt}
            placeholder={savedItem.prompt}
            onChange={e => onChangePrompt(e.target.value)}
          />
          Abfrage
        </LabelWithSpacing>
      </InputsColumn>

      <EditStatus saving={saving} saved={saved} error={error} submit={submit} />
    </Container>
  );
};

const Container = styled.form`
  display: flex;
  align-items: center;
`;

const MetaColumn = styled.div`
  width: 20px;
  align-self: stretch;
  flex-shrink: 0;
  font-size: ${({ theme: { font } }) => font.sizes.xxs};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 12px;
  margin-bottom: 12px;
`;

const Index = styled.div`
  display: flex;
  justify-content: center;
  color: ${({ theme: { colors } }) => colors.grey[75]};
`;

const Delete = styled.div`
  color: ${({ theme: { colors } }) => colors.negative[50]};
`;

const InputsColumn = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
`;

const LabelWithSpacing = styled(Label)`
  margin-right: 20px;
  margin-bottom: 12px;
  flex-basis: 200px;
  flex-grow: 1;
`;
