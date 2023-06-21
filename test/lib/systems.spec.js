import { expect } from 'chai';
import {
  CrewExchange,
  CrewStation,
  CrewmateRecruitment,
  Delegate,
  FoodSupply,
  InventoryTransfer,
  GrantPermission,
  RevokePermission,
  AssignPolicy,
  RemovePolicy,
  Recruitment,
  ResourceScanStart,
  ResourceScanFinish,
  SurfaceScanStart,
  SurfaceScanFinish,
  NameChange
} from '../../src/systems.js';

describe('Systems', function () {
  describe('CrewExchange::format', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = CrewExchange.format(
        { label: 'Crew', id: 1 },
        [1, 2, 3],
        { label: 'Crew', id: 2 },
        [1, 2, 3, 4, 5]
      );
      expect(name).to.equal('CrewExchange');
      expect(calldata.length).to.equal(14);
      expect(calldata).to.deep.equal([
        '1131570551', '1',
        '3', '1', '2', '3',
        '1131570551', '2',
        '5', '1', '2', '3', '4', '5'
      ]);
    });
  });

  describe('CrewStation::format', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = CrewStation.format({ label: 'Station', id: 1 }, { label: 'Crew', id: 1 });
      expect(name).to.equal('CrewStation');
      expect(calldata.length).to.equal(4);
      expect(calldata).to.deep.equal(['23490384980701038', '1', '1131570551', '1']);
    });
  });

  describe('CrewmateRecruitment::format', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = CrewmateRecruitment.format({ label: 'Crewmate', id: 1 });
      expect(name).to.equal('CrewmateRecruitment');
      expect(calldata.length).to.equal(2);
      expect(calldata).to.deep.equal(['4860058511496803429', '1']);
    });
  });

  describe('Delegate::format', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = Delegate.format({ label: 'Asteroid', id: 1 }, '0x0111');
      expect(name).to.equal('Delegate');
      expect(calldata.length).to.equal(3);
      expect(calldata).to.deep.equal(['4716241213847464292', '1', '273']);
    });
  });

  describe('FoodSupply::format', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = FoodSupply.format({ label: 'Asteroid', id: 1 }, 1, 100, { label: 'Crew', id: 1 });
      expect(name).to.equal('FoodSupply');
      expect(calldata.length).to.equal(6);
      expect(calldata).to.deep.equal(['4716241213847464292', '1', '1', '100', '1131570551', '1']);
    });
  });

  describe('InventoryTransfer::format', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = InventoryTransfer.format(
        { label: 'Extractor', id: 1 },
        1,
        [1, 2, 3, 4],
        { label: 'Warehouse', id: 2 },
        1,
        { label: 'Crew', id: 1 }
      );
      expect(name).to.equal('InventoryTransfer');
      expect(calldata.length).to.equal(13);
      expect(calldata).to.deep.equal([
        '1281505029230414819186', '1',
        '1',
        '4', '1', '2', '3', '4',
        '1611888520680975987557',
        '2',
        '1',
        '1131570551',
        '1'
      ]);
    });
  });

  describe('GrantPermission', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = GrantPermission.format(
        { label: 'Habitat', id: 1 },
        1,
        { label: 'Crew', id: 2 },
        { label: 'Crew', id: 1 },
        [1, 2, 3, 4]
      );
      expect(name).to.equal('GrantPermission');
      expect(calldata.length).to.equal(12);
      expect(calldata).to.deep.equal([
        '20373273627091316', '1',
        '1',
        '1131570551', '2',
        '1131570551', '1',
        '4', '1', '2', '3', '4'
      ]);
    });
  });

  describe('RevokePermission', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = RevokePermission.format(
        { label: 'Habitat', id: 1 },
        1,
        { label: 'Crew', id: 2 },
        { label: 'Crew', id: 1 },
        [1, 2, 3, 4]
      );
      expect(name).to.equal('RevokePermission');
      expect(calldata.length).to.equal(12);
      expect(calldata).to.deep.equal([
        '20373273627091316', '1',
        '1',
        '1131570551', '2',
        '1131570551', '1',
        '4', '1', '2', '3', '4'
      ]);
    });
  });

  describe('AssignPolicy', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = AssignPolicy.format(
        { label: 'Habitat', id: 1 },
        1,
        { label: 'Policy', id: 1 },
        { label: 'Crew', id: 1 }
      );
      expect(name).to.equal('AssignPolicy');
      expect(calldata.length).to.equal(7);
      expect(calldata).to.deep.equal([
        '20373273627091316', '1',
        '1',
        '88439490438009', '1',
        '1131570551', '1'
      ]);
    });
  });

  describe('RemovePolicy', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = RemovePolicy.format(
        { label: 'Habitat', id: 1 },
        1,
        { label: 'Crew', id: 1 }
      );
      expect(name).to.equal('RemovePolicy');
      expect(calldata.length).to.equal(5);
      expect(calldata).to.deep.equal(['20373273627091316', '1', '1', '1131570551', '1']);
    });
  });

  describe('NameChange::format', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = NameChange.format({ label: 'Asteroid', id: 1 }, 'New Name');
      expect(name).to.equal('NameChange');
      expect(calldata.length).to.equal(3);
      expect(calldata).to.deep.equal(['4716241213847464292', '1', '5649052288243821925']);
    });
  });

  describe('Recruitment::format', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = Recruitment.format({ label: 'Crew', id: 1 });
      expect(name).to.equal('Recruitment');
      expect(calldata.length).to.equal(2);
      expect(calldata).to.deep.equal(['1131570551', '1']);
    });
  });

  describe('ResourceScanStart::format', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = ResourceScanStart.format({ label: 'Asteroid', id: 1 }, { label: 'Crew', id: 1 });
      expect(name).to.equal('ResourceScanStart');
      expect(calldata.length).to.equal(4);
      expect(calldata).to.deep.equal(['4716241213847464292', '1', '1131570551', '1']);
    });
  });

  describe('ResourceScanFinish::format', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = ResourceScanFinish.format({ label: 'Asteroid', id: 1 }, { label: 'Crew', id: 1 });
      expect(name).to.equal('ResourceScanFinish');
      expect(calldata.length).to.equal(4);
      expect(calldata).to.deep.equal(['4716241213847464292', '1', '1131570551', '1']);
    });
  });

  describe('SurfaceScanStart::format', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = SurfaceScanStart.format({ label: 'Asteroid', id: 1 }, { label: 'Crew', id: 1 });
      expect(name).to.equal('SurfaceScanStart');
      expect(calldata.length).to.equal(4);
      expect(calldata).to.deep.equal(['4716241213847464292', '1', '1131570551', '1']);
    });
  });

  describe('SurfaceScanFinish::format', function () {
    it('should format the data correctly', function () {
      const { name, calldata } = SurfaceScanFinish.format({ label: 'Asteroid', id: 1 });
      expect(name).to.equal('SurfaceScanFinish');
      expect(calldata.length).to.equal(2);
      expect(calldata).to.deep.equal(['4716241213847464292', '1']);
    });
  });
});
