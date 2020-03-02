import { getNewShapePosition } from './AutoPlaceUtil';


/**
 * A service that places elements connected to existing ones
 * to an appropriate position in an _automated_ fashion.
 *
 * @param {EventBus} eventBus
 * @param {Modeling} modeling
 */
export default function AutoPlace(eventBus, modeling) {

  /**
   * Append shape to source at appropriate position.
   *
   * @param {djs.model.Shape} source
   * @param {djs.model.Shape} shape
   *
   * @return {djs.model.Shape} appended shape
   */
  this.append = function(source, shape, hints) {

    eventBus.fire('autoPlace.start', {
      source: source,
      shape: shape
    });

    // allow others to provide the position
    var position = eventBus.fire('autoPlace', {
      source: source,
      shape: shape
    });

    if (!position) {
      position = getNewShapePosition(source, shape);
    }

    var newShape = modeling.appendShape(source, shape, position, source.parent, hints);

    eventBus.fire('autoPlace.end', {
      source: source,
      shape: newShape
    });

    return newShape;
  };

}

AutoPlace.$inject = [
  'eventBus',
  'modeling'
];