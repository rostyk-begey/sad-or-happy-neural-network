export default class Input {
  constructor(neuron, weight, id) {
    Object.defineProperty(this, 'neuron', {
      enumerable: false,
      value: neuron,
    });
    this.weight = weight;
    this.id = id;
  }
}
