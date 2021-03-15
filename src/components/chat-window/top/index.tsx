import React from 'react';
import {Link} from 'react-router-dom';
import {ButtonToolbar, Icon} from 'rsuite';
import {useCurrentRoom} from '../../../context/CurrentRoomContext';
import {useMediaQuery} from '../../../hooks/useMediaQuery';
import EditRoomBtnDrawer from './EditRoomBtnDrawer';
import RoomInfoBtnModal from './RoomInfoBtnModal';

const Top: React.FC = () => {
  const name = useCurrentRoom((v) => v.name);
  const isAdmin = useCurrentRoom((v) => v.isAdmin);
  const isMobile = useMediaQuery('(max-width: 992px)');

  return (
    <div>
      <div className="d-flex justify-conent-between align-items-center">
        <h4 className="text-disappear d-flex align-items-center">
          <Icon
            componentClass={Link}
            icon="arrow-circle-left"
            size="2x"
            className={
              isMobile
                ? 'd-inline-block p-0 mr-2 text-blue link-unstyled'
                : 'd-none'
            }
          />
          <span className="text-disappear">{name}</span>
        </h4>
        <ButtonToolbar className="ws-nowrap">
          {isAdmin && <EditRoomBtnDrawer />}
        </ButtonToolbar>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span>Todo</span>
        <RoomInfoBtnModal />
      </div>
    </div>
  );
};

export default React.memo(Top);
