
export class HoldIntent {
 constructor(setTarget){this.setTarget=setTarget;this.held=false;this.locked=false;}
 begin(){if(this.locked)return;this.held=true;this.setTarget(true);}
 sample(progress){if(this.held&&progress>=1){this.locked=true;this.held=false;}}
 release(progress){this.sample(progress);this.held=false;if(!this.locked)this.setTarget(false);}
 explore(){this.locked=true;this.held=false;this.setTarget(true);}
 close(){this.locked=false;this.held=false;this.setTarget(false);}
}
