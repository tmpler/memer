var app = angular.module('memer', []);


app.factory('memes', [function(){
  var o = {
    memes : []
  };
  o.add = function(meme){
    this.memes.push(meme);
  };
  return o;
}]);
app.factory('karma', [function(){
  var o = {
    quantity : 4
  };
  o.add = function(meme){
    this.memes.push(meme);
  };
  o.buy = function(meme,quantity){
    for(i=0;i<quantity;i++){
      if(this.quantity>=(meme.cost)){
        this.quantity -= (meme.cost);
        meme.buy(1);
        meme.cost = Math.ceil(meme.cost*meme.coeff);
      };
    };
  };
  o.buyAll = function(meme){
    while(this.quantity>=(meme.cost)){
      this.quantity -= (meme.cost);
      meme.buy(1);
      meme.cost = Math.ceil(meme.cost*meme.coeff);
    };
  };
  o.costOfAll = function(meme){
    var c = meme.cost;
    var m = 0;
    var q = this.quantity;
    while(q>=(c)){
      q-=c;
      m+=c;
      c = Math.ceil(c*meme.coeff);
    };
    return m;
  };
  o.upgrade = function(meme){
    if(this.quantity>=meme.upgradeCost){
      this.quantity-= meme.upgradeCost;
      meme.upgrade();
    };
  };
  return o;
}]);

app.controller('MainCtrl', [
'$scope',
'memes',
'karma',
'$interval',
function($scope,memes,karma,$interval){
  $scope.pres = ["scrub","newb","facebook","knowyourmeme","buzzfeed","ladbible","9gag","reddit","4chan","OP","OP","OP","OP","OP"];
  $scope.game = {
    memes : memes,
    karma : karma
  };
  $scope.experience = 0;
  $scope.level = 1;
  $scope.title = "scrub";
  var levels = [{"level":1,"xp":0}];
  var points = 0;
  var output = 0;
  var minlevel = 2; // first level to display
  var maxlevel = 9001; // last level to display

  for (lvl = 1; lvl <= maxlevel; lvl++){
    points += Math.floor(lvl + 300 * Math.pow(2, lvl / 7.));
    if (lvl >= minlevel)
      levels.push({
        "level": lvl,
        "xp": output
      });
    output = Math.floor(points / 4);
  };

  var Meme = function(name,value,cost,quantity,visible,max){
    this.name = name;
    this.level = 0;
    this.value = value;
    this.cost = cost;
    this.base = cost;
    this.upgradeCost = cost * 100;
    this.quantity = quantity;
    this.visible = visible;
    this.max = max;
    this.coeff = (max/100) + 1;
  };
  Meme.prototype.set = function (key,value){
    this[key] = value;
  };
  Meme.prototype.buy = function (quantity){
    this.quantity += quantity;
    if(!this.visible){
      this.visible = true;
    };
  };
  Meme.prototype.upgrade = function(){
    if(this.level<this.max){
      this.level++;
      this.cost = Math.ceil(Math.pow(this.base,this.coeff));
      this.base = this.cost;
      this.upgradeCost = Math.ceil(Math.pow(this.upgradeCost,this.coeff));
      this.value = this.value*(this.level+1);
      this.quantity = 0;
    };
    if(this.level==this.max){
      this.upgradeCost = "MAX";
    };
  };

  $scope.game.memes.add(new Meme("datboi",100,4,0,true,13));
  $scope.game.memes.add(new Meme("pepe",1200,60,0,false,9));
  $scope.game.memes.add(new Meme("whowouldwin",5400,720,0,false,12));
  $scope.game.memes.add(new Meme("arthursfist",21600,8640,0,false,9));
  $scope.game.memes.add(new Meme("spongebob",1296000,103680,0,false,9));
  $scope.game.memes.add(new Meme("betteridea",388800,1244160,0,false,11));
  $scope.game.memes.add(new Meme("prequel",1166400,14929920,0,false,12));
  $scope.game.memes.add(new Meme("dankchristian",3499200,179159040,0,false,12));
  $scope.game.memes.add(new Meme("wholesome",10497600,2149908480,0,false,13));
  $scope.game.memes.add(new Meme("norm",48288960,25798901760,0,false,12));
  $scope.increment = function(){
    var k = 0;
    angular.forEach($scope.game.memes.memes, function(meme,key){
      if($scope.game.karma.quantity>=meme.cost){
        meme.visible = true;
      };
      if(meme.quantity>0){
        k+=Math.floor(meme.quantity*meme.value/12);
        $scope.experience += (meme.quantity*(meme.level+1));
      };
    });
    $scope.game.karma.quantity += k;
    if(levels[$scope.level].xp<=$scope.experience){
      $scope.level = levels[$scope.level].level;
      $scope.title = $scope.pres[Math.ceil($scope.level/15)];
      if($scope.level>9000){
        $scope.title = "Goku";
      };
    }
  };
  $scope.abbreviateNumber = function(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "k", "m", "b","t","q","Q","s","S","o","n","d"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0)  shortNum = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
  };
  $interval(function(){
    $scope.increment();
  },5000);
}]);
