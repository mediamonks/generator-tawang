import Scene from 'Scene';
import FaceTracking from 'FaceTracking';
import Diagnostics from 'Diagnostics';

import TestModule from './test-module';

Scene.root.child('plane0').transform.rotationX = FaceTracking.face(0).cameraTransform.rotationX.neg();
Scene.root.child('plane0').transform.rotationY = FaceTracking.face(0).cameraTransform.rotationY;
Scene.root.child('plane0').transform.rotationZ = FaceTracking.face(0).cameraTransform.rotationZ.neg();

Diagnostics.log(TestModule);

test.test();
