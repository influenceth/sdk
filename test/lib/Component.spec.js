import { expect } from 'chai';
import Component from '../../src/lib/Component.js';
import Asteroid from '../../src/lib/asteroid.js';

describe('Component library', function () {
  describe('getComponentNames', function () {
    it('should return a non-empty list of component names', function () {
      const names = Component.getComponentNames();
      expect(names).to.be.an('array').that.is.not.empty;
      expect(names).to.include('Celestial');
      expect(names).to.include('Crew');
      expect(names).to.include('Building');
    });
  });

  describe('getSchema', function () {
    it('should return schema for a known component by short name', function () {
      const schema = Component.getSchema('Celestial');
      expect(schema).to.be.an('object');
      expect(schema.members).to.be.an('array').that.is.not.empty;
      const memberNames = schema.members.map((m) => m.name);
      expect(memberNames).to.include('celestial_type');
      expect(memberNames).to.include('bonuses');
    });

    it('should return schema for a known component by full ABI key', function () {
      const schema = Component.getSchema('influence::components::celestial::Celestial');
      expect(schema).to.be.an('object');
      expect(schema.members).to.be.an('array').that.is.not.empty;
    });

    it('should throw for an unknown component name', function () {
      expect(() => Component.getSchema('NonExistent')).to.throw(/Unknown component/);
    });
  });

  describe('fromChain', function () {
    it('should convert snake_case keys to camelCase', function () {
      const raw = {
        celestial_type: 3,
        mass: 100000,
        radius: 5.5,
        purchase_order: 1,
        scan_status: 4,
        scan_finish_time: 0,
        bonuses: 12345,
        abundances: 67890,
      };
      const celestial = Component.fromChain('Celestial', raw);
      expect(celestial).to.have.property('celestialType', 3);
      expect(celestial).to.have.property('mass', 100000);
      expect(celestial).to.have.property('radius', 5.5);
      expect(celestial).to.have.property('scanStatus', 4);
      expect(celestial).to.have.property('scanFinishTime', 0);
      expect(celestial).to.have.property('bonuses', 12345);
      expect(celestial).to.have.property('abundances', 67890);
      // Original snake_case keys should not be present
      expect(celestial).to.not.have.property('celestial_type');
      expect(celestial).to.not.have.property('scan_status');
    });

    it('should accept full ABI key as component name', function () {
      const raw = { celestial_type: 7, mass: 1, radius: 10, bonuses: 0, abundances: 0 };
      const celestial = Component.fromChain('influence::components::celestial::Celestial', raw);
      expect(celestial).to.have.property('celestialType', 7);
    });

    it('should pass-through unknown keys (camelCased)', function () {
      const raw = { celestial_type: 1, extra_field: 'hello' };
      const celestial = Component.fromChain('Celestial', raw);
      expect(celestial).to.have.property('celestialType', 1);
      expect(celestial).to.have.property('extraField', 'hello');
    });

    it('should throw when rawData is null or missing', function () {
      expect(() => Component.fromChain('Celestial', null)).to.throw();
      expect(() => Component.fromChain('Celestial', undefined)).to.throw();
    });

    it('should throw for unknown component name', function () {
      expect(() => Component.fromChain('Bogus', { foo: 1 })).to.throw(/Unknown component/);
    });

    it('should produce a Celestial component usable by Asteroid.Component methods', function () {
      // Values that produce a deterministic result
      const rawCelestial = {
        celestial_type: 7,   // S_TYPE
        mass: 0,             // not used by getSize/getSpectralType
        radius: 15,          // km – "Medium" size
        purchase_order: 0,
        scan_status: 4,
        scan_finish_time: 0,
        bonuses: 0,
        abundances: 0,
      };
      const celestial = Component.fromChain('Celestial', rawCelestial);

      // Asteroid.Component.getSize expects { radius }
      expect(Asteroid.Component.getSize(celestial)).to.equal('Medium');

      // Asteroid.Component.getSpectralType expects { celestialType }
      const spectral = Asteroid.Component.getSpectralType(celestial);
      expect(spectral).to.equal('S');
    });
  });
});
