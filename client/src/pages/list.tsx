import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '../elements/spinner';
import { Heading, Paragraph } from '../elements/typography';
import { routes } from '../helpers/api-routes';
import { ListSummary, LoadingStates } from '../models';

export const List: FC = () => {
  const { slug } = useParams();
  const [list, setList] = useState<ListSummary | null>(null);
  const [state, setState] = useState<LoadingStates>(LoadingStates.initial);

  const fetchList = async () => {
    if (!slug) {
      return;
    }

    try {
      setState(LoadingStates.loading);
      const res = await fetch(routes.listBySlug(slug));
      if (res.status !== 200) {
        throw new Error(`Error: ${res.status}`);
      }
      const listWithItems: ListSummary = await res.json();
      setList(listWithItems);
      setState(LoadingStates.loaded);
    } catch (error) {
      console.error(error);
      setList(null);
      setState(LoadingStates.error);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchList();
    }
  }, [slug]);

  if (state === 'loading' || state === 'initial') {
    return <Spinner />;
  }

  if (state === 'error') {
    return (
      <>
        <Heading>¯\_(ツ)_/¯</Heading>
        <Paragraph>Unter dieser Adresse existiert keine Liste.</Paragraph>
      </>
    );
  }

  if (!list) return null;

  return (
    <div>
      <div>
        <strong>items: </strong>
        {list.itemsCount}
      </div>

      <br />

      <div>
        {Object.entries(list.progress!.stages).map(([key, value]) => (
          <div>
            stage {key}: {value} items
          </div>
        ))}
      </div>
    </div>
  );
};
