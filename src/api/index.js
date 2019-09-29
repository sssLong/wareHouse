/**
 * api的统一出口
 */

// 各模块导入
import BasicConfiguration from './BasicConfiguration'
import Warehousing from './Warehousing'
import UserManage from './Usermanage'
import WarehouseInside from './WarehouseInside'
import WarehouseData from './WarehouseData'
import OutgoingOperation from './OutgoingOperation'
import LogisticsManage from './LogisticsManage'

// 导出API
export default {
    //  ...
    BasicConfiguration,
    Warehousing,
    UserManage,
    WarehouseInside,
    WarehouseData,
    OutgoingOperation,
    LogisticsManage
};
