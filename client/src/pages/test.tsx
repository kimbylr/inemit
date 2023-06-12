import { FC } from 'react';
import { Button } from '../elements/button';
import { Icon } from '../elements/icon';

export const Test: FC = () => {
  return (
    <>
      <h2>inemit! Wörter lernen!</h2>
      <p>
        Hello. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi,{' '}
        <em>laborum. Lorem ipsum dolor sit amet</em> consectetur adipisicing{' '}
        <strong>
          elit. Quo, hic. Dolores unde <em>necessitatibus</em>
        </strong>{' '}
        cumque omnis quis laborum exercitationem alias reiciendis?
      </p>
      <p>
        <Button>asdf</Button>
        <Button primary>primary</Button>
      </p>

      <div className="flex flex-wrap">
        <div className="w-24 h-24">
          <Icon type="chevronDown" />
        </div>
        <div className="w-24 h-24">
          <Icon type="ok" />
        </div>
        <div className="w-24 h-24">
          <Icon type="new" />
        </div>
        <div className="w-24 h-24">
          <Icon type="attention" />
        </div>

        <div className="w-24 h-24">
          <Icon type="sync" />
        </div>
        <div className="w-24 h-24">
          <div className="spin">
            <Icon type="syncInCircle" />
          </div>
        </div>
        <div className="w-24 h-24">
          <Icon type="deleteInCircle" />
        </div>
        <div className="w-24 h-24">
          <Icon type="edit" />
        </div>

        <div className="h-5 w-5">
          <Icon type="attention" />
        </div>
        <div className="h-5 w-5">
          <Icon type="ok" />
        </div>
        <div className="h-5 w-5">
          <Icon type="new" />
        </div>
        <div className="h-5 w-5">
          <Icon type="sync" />
        </div>
        <div className="h-5 w-5">
          <Icon type="flag" />
        </div>
      </div>
      <div style={{ clear: 'both', margin: '10px 0' }}>&nbsp;</div>

      <div>
        <div className="w-24 h-24">
          <Icon type="addList" />
        </div>
        <div className="w-24 h-24">
          <Icon type="logo" />
        </div>
        <div className="w-24 h-24">
          <Icon type="next" />
        </div>
        <div className="w-24 h-24">
          <Icon type="cancel" />
        </div>
        <div className="w-24 h-24">
          <Icon type="flag" />
        </div>
      </div>

      <div style={{ clear: 'both', margin: '10px 0' }}>&nbsp;</div>

      <div>
        <div className="bg-grey-10 h-24 w-24">10</div>
        <div className="bg-grey-25 h-24 w-24">25</div>
        <div className="bg-grey-50 h-24 w-24">50</div>
        <div className="bg-grey-60 h-24 w-24">60</div>
        <div className="bg-grey-75 h-24 w-24">75</div>
        <div className="bg-grey-85 h-24 w-24">85</div>
        <div className="bg-grey-95 h-24 w-24">95</div>
        <div className="bg-grey-98 h-24 w-24">98</div>
      </div>
    </>
  );
};
