export interface Keypoint {
  x: number;
  y: number;
  score: number;
}

export interface Pose {
  keypoints: Keypoint[];
  score: number;
}

const calculateDistance = (p1: Keypoint, p2: Keypoint): number => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};

const calculateAngle = (a: Keypoint, b: Keypoint, c: Keypoint): number => {
  const ba = { x: a.x - b.x, y: a.y - b.y };
  const bc = { x: c.x - b.x, y: c.y - b.y };

  const dotProduct = ba.x * bc.x + ba.y * bc.y;
  const baLength = Math.sqrt(ba.x ** 2 + ba.y ** 2);
  const bcLength = Math.sqrt(bc.x ** 2 + bc.y ** 2);

  if (baLength === 0 || bcLength === 0) return 0;

  const cosAngle = dotProduct / (baLength * bcLength);
  return Math.acos(Math.min(1, Math.max(-1, cosAngle))) * (180 / Math.PI);
};

const getKeypoint = (pose: Pose, index: number): Keypoint | null => {
  const kp = pose.keypoints[index];
  return kp && kp.score > 0.3 ? kp : null;
};

export class ExerciseDetector {
  protected lastReps = 0;
  protected isInDownPosition = false;
  protected lastAngle = 0;

  abstract detectRep(pose: Pose): boolean;

  getReps(): number {
    return this.lastReps;
  }

  reset(): void {
    this.lastReps = 0;
    this.isInDownPosition = false;
    this.lastAngle = 0;
  }
}

export class PushupDetector extends ExerciseDetector {
  private repThreshold = 25;

  detectRep(pose: Pose): boolean {
    const leftShoulder = getKeypoint(pose, 5);
    const leftElbow = getKeypoint(pose, 7);
    const leftWrist = getKeypoint(pose, 9);
    const rightShoulder = getKeypoint(pose, 6);
    const rightElbow = getKeypoint(pose, 8);
    const rightWrist = getKeypoint(pose, 10);

    if (!leftElbow || !rightElbow) return false;

    let elbowAngle = 180;
    if (leftShoulder && leftWrist) {
      elbowAngle = Math.min(
        elbowAngle,
        calculateAngle(leftShoulder, leftElbow, leftWrist)
      );
    }
    if (rightShoulder && rightWrist) {
      elbowAngle = Math.min(
        elbowAngle,
        calculateAngle(rightShoulder, rightElbow, rightWrist)
      );
    }

    const wasDown = this.isInDownPosition;
    this.isInDownPosition = elbowAngle < this.repThreshold;

    if (wasDown && !this.isInDownPosition && elbowAngle > 150) {
      this.lastReps++;
      return true;
    }

    this.lastAngle = elbowAngle;
    return false;
  }

  getFormFeedback(): string {
    if (this.isInDownPosition) {
      return this.lastAngle < 15 ? "Perfect form!" : "Go lower for full rep!";
    }
    return "Press up to complete rep";
  }
}

export class SquatDetector extends ExerciseDetector {
  private repThreshold = 100;

  detectRep(pose: Pose): boolean {
    const leftHip = getKeypoint(pose, 11);
    const leftKnee = getKeypoint(pose, 13);
    const leftAnkle = getKeypoint(pose, 15);
    const rightHip = getKeypoint(pose, 12);
    const rightKnee = getKeypoint(pose, 14);
    const rightAnkle = getKeypoint(pose, 16);

    if (!leftKnee || !rightKnee) return false;

    let kneeAngle = 180;
    if (leftHip && leftAnkle) {
      kneeAngle = Math.min(
        kneeAngle,
        calculateAngle(leftHip, leftKnee, leftAnkle)
      );
    }
    if (rightHip && rightAnkle) {
      kneeAngle = Math.min(
        kneeAngle,
        calculateAngle(rightHip, rightKnee, rightAnkle)
      );
    }

    const wasDown = this.isInDownPosition;
    this.isInDownPosition = kneeAngle < this.repThreshold;

    if (wasDown && !this.isInDownPosition && kneeAngle > 140) {
      this.lastReps++;
      return true;
    }

    this.lastAngle = kneeAngle;
    return false;
  }

  getFormFeedback(): string {
    if (this.isInDownPosition) {
      return this.lastAngle < 85 ? "Good depth!" : "Go lower for full squat!";
    }
    return "Stand up to complete rep";
  }
}

export class SitupDetector extends ExerciseDetector {
  private repThreshold = 120;

  detectRep(pose: Pose): boolean {
    const nose = getKeypoint(pose, 0);
    const leftHip = getKeypoint(pose, 11);
    const rightHip = getKeypoint(pose, 12);

    if (!nose || !leftHip || !rightHip) return false;

    const hipMidpoint = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2,
      score: 0.5
    };

    const torsoAngle = calculateDistance(nose, hipMidpoint);
    const normalizedAngle = Math.min(torsoAngle * 50, 180);

    const wasDown = this.isInDownPosition;
    this.isInDownPosition = normalizedAngle < this.repThreshold;

    if (wasDown && !this.isInDownPosition && normalizedAngle > 140) {
      this.lastReps++;
      return true;
    }

    this.lastAngle = normalizedAngle;
    return false;
  }

  getFormFeedback(): string {
    if (this.isInDownPosition) {
      return "Great, curl up now!";
    }
    return "Lie back to complete rep";
  }
}
