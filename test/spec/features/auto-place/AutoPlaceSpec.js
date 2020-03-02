import {
  bootstrapDiagram,
  inject
} from 'test/TestHelper';

import autoPlaceModule from 'lib/features/auto-place';
import coreModule from 'lib/core';
import modelingModule from 'lib/features/modeling';
import selectionModule from 'lib/features/selection';

import { getMid } from 'lib/layout/LayoutUtil';


describe('features/auto-place', function() {

  beforeEach(bootstrapDiagram({
    modules: [
      autoPlaceModule,
      coreModule,
      modelingModule,
      selectionModule
    ]
  }));

  var root, shape, newShape;

  beforeEach(inject(function(canvas, elementFactory) {
    root = elementFactory.createRoot({
      id: 'root'
    });

    canvas.setRootElement(root);

    shape = elementFactory.createShape({
      id: 'shape',
      x: 0,
      y: 0,
      width: 100,
      height: 100
    });

    canvas.addShape(shape, root);

    newShape = elementFactory.createShape({
      id: 'newShape',
      width: 100,
      height: 100
    });
  }));


  describe('element placement', function() {

    it('at default distance', inject(function(autoPlace) {

      // when
      autoPlace.append(shape, newShape);

      // then
      expect(newShape).to.have.bounds({
        x: 150,
        y: 0,
        width: 100,
        height: 100
      });
    }));

  });


  describe('integration', function() {

    it('should select', inject(function(autoPlace, selection) {

      // when
      autoPlace.append(shape, newShape);

      // then
      expect(selection.get()).to.eql([ newShape ]);
    }));

  });


  describe('eventbus integration', function() {

    it('<autoPlace.start>', inject(function(autoPlace, eventBus) {

      // given
      var listener = sinon.spy(function(event) {

        // then
        expect(event.shape).to.equal(newShape);
        expect(event.source).to.equal(shape);
      });

      eventBus.on('autoPlace.start', listener);

      // when
      autoPlace.append(shape, newShape);

      expect(listener).to.have.been.called;
    }));


    it('<autoPlace>', inject(function(autoPlace, eventBus) {

      // given
      var listener = sinon.spy(function(event) {

        // then
        expect(event.shape).to.equal(newShape);
        expect(event.source).to.equal(shape);

        return {
          x: 0,
          y: 0
        };
      });

      eventBus.on('autoPlace', listener);

      // when
      newShape = autoPlace.append(shape, newShape);

      expect(listener).to.have.been.called;

      expect(getMid(newShape)).to.eql({
        x: 0,
        y: 0
      });
    }));


    it('<autoPlace.end>', inject(function(autoPlace, eventBus) {

      // given
      var listener = sinon.spy(function(event) {

        // then
        expect(event.shape).to.equal(newShape);
        expect(event.source).to.equal(shape);
      });

      eventBus.on('autoPlace.end', listener);

      // when
      newShape = autoPlace.append(shape, newShape);

      expect(listener).to.have.been.called;
    }));

  });


  it('should pass hints', inject(function(autoPlace) {

    // when
    autoPlace.append(shape, newShape, {
      connectionTarget: shape
    });

    // then
    expect(newShape.outgoing).to.have.lengthOf(1);
    expect(shape.incoming).to.have.lengthOf(1);
  }));

});
