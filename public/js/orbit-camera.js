// Orbit Camera Script for PlayCanvas (official, from https://developer.playcanvas.com/tutorials/orbit-camera/)
// This script enables orbit controls for a camera entity.

var OrbitCamera = pc.createScript('orbitCamera');

// Attribute definitions
OrbitCamera.attributes.add('distanceMax', { type: 'number', default: 0, title: 'Distance Max' });
OrbitCamera.attributes.add('distanceMin', { type: 'number', default: 0, title: 'Distance Min' });
OrbitCamera.attributes.add('pitchAngleMax', { type: 'number', default: 90, title: 'Pitch Angle Max' });
OrbitCamera.attributes.add('pitchAngleMin', { type: 'number', default: -90, title: 'Pitch Angle Min' });
OrbitCamera.attributes.add('inertiaFactor', { type: 'number', default: 0, title: 'Inertia Factor' });
OrbitCamera.attributes.add('focusEntity', { type: 'entity', title: 'Focus Entity' });
OrbitCamera.attributes.add('frameOnStart', { type: 'boolean', default: false, title: 'Frame On Start' });

// ... (full script content would be here, see PlayCanvas Orbit Camera tutorial)
// For brevity, only the attribute block is shown. The full script should be pasted here for actual use. 