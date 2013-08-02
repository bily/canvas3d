var document = document || {};
//C3Dコンストラクタ
var C3D = function () {
	'use strict';
};
//C3Dメソッド
C3D.prototype = {};
//Geometryコンストラクタ
C3D.Geometry = function () {
	'use strict';
	//Publicプロパティ
	this.vertices = [];
	this.edges = [];
	this.faces = [];
};
//Geometryメソッド
C3D.Geometry.prototype = {
	addVertices : function (vertex) {
		'use strict';
		this.vertices.push(vertex);
	},
	addEdges : function (edge) {
		'use strict';
		this.edges.push(edge);
	},
	addFaces : function (face) {
		'use strict';
		this.faces.push(face);
	},
	getEdgeVertices : function (index) {
		'use strict';
		return [this.vertices[this.edges[index][0]], this.vertices[this.edges[index][1]]];
	},
	getFaceVertices : function (index) {
		'use strict';
		var result = [],
			i;
		for (i = 0; i < this.faces[index].length; i = i + 1) {
			result.push(this.verticies[this.faces[index][i]]);
		}
		return result;
	}
};
//Faceコンストラクタ
C3D.Face = function (vertices, normal, color) {
	'use strict';
	this.vertices = vertices;
	this.normal = normal.normalize() || new C3D.Vector3(0, 0, 1);
	this.color = color || 0x888888;
	this.centroids = [];
	this.initCentroids();
};
//Faceメソッド
C3D.Face.prototype = {
	initCentroids : function () {
		'use strict';
		var i,
			sum_x = 0,
			sum_y = 0,
			sum_z = 0;
		for (i = 0; i < this.vertices.length; i = i + 1) {
			sum_x += this.vertices[i][0];
			sum_y += this.vertices[i][1];
			sum_z += this.vertices[i][2];
		}
		return new C3D.Vector3(sum_x / this.vertices.length, sum_y / this.vertices.length, sum_z / this.vertices.length).normalize();
	}
};
//Rendererコンストラクタ
C3D.Renderer = function () {
	'use strict';
	//Publicプロパティ
	this.canvas = document.createElement('canvas');
	this.context = this.canvas.getContext('2d');
	
	
};
//Rendererメソッド
C3D.Renderer.prototype = {
	//Sizeプロパティの設定
	setSize : function (width, height) {
		'use strict';
		this.canvas.style.width = width;
		this.canvas.style.height = height;
		this.canvas.width = width;
		this.canvas.height = height;
		this.width = width;
		this.height = height;
	},
	//sceneの描画
	render : function (scene, camera) {
		'use strict';
		this.context.clearRect(0, 0, this.width, this.height);
		this.context.beginPath();
		this.context.lineWidth = 1;
		this.context.strokeStyle = "#000000";
		this.context.moveTo(10, 10);
		this.context.lineTo(20, 20);
		this.context.stroke();
	},
	//線の描画
	line : function (v1, v2) {
		'use strict';
		this.context.beginPath();
		this.context.moveTo(v1.x, v1.y);
		this.context.lineTo(v2.x, v2.y);
		this.context.stroke();
	},
	//点の描画
	dot : function (v) {
		'use strict';
		this.context.beginPath();
		this.context.arc(v.x, v.y, 1, 0, Math.PI * 2, false);
		this.context.fill();
	}
};

//Sceneオブジェクト
C3D.Scene = function () {
	'use strict';
	this.geometries = [];
};
//Screneメソッド
C3D.Scene.prototype = {
	add : function (geometry) {
		'use strict';
		this.geometries.push(geometry);
	}
};

//Cameraコンストラクタ
C3D.Camera = function (angle, aspect, position, lookAt, upperPoint) {
	'use strict';
	this.angle = angle || 0;
	this.aspect = aspect || 0;
	this.position = position || new C3D.Vector3(0, 0, 100);
	this.lookAt = lookAt || new C3D.Vector3();
	this.upperPoint = upperPoint || new C3D.Vector3(0, 100, 0);
	this.direction = this.position.directionTo(this.lookAt).normalize();
	this.right = C3D.Vector3.ExteriorProduct(this.direction, this.position.directionTo(this.upperPoint)).normalize();
	this.up = C3D.Vector3.ExteriorProduct(this.right, this.direction).normalize();
	this.initVector();
};
C3D.Camera.prototype = {
	setAngle : function (angle) {
		'use strict';
		this.angle = angle;
	},
	setAspect : function (aspect) {
		'use strict';
		this.aspect = aspect;
	},
	setPosition : function (position) {
		'use strict';
		this.position = position;
	},
	setLookAt : function (pos) {
		'use strict';
		this.lookAt = pos.normalise;
	},
	initVector : function () {
		'use strict';
		this.direction = this.position.directionTo(this.lookAt).normalize();
		this.right = C3D.Vector3.ExteriorProduct(this.direction, this.position.directionTo(this.upperPoint)).normalize();
		this.up = C3D.Vector3.ExteriorProduct(this.right, this.direction).normalize();
	}
};
//Vector3コンストラクタ
C3D.Vector3 = function (x, y, z) {
	'use strict';
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
};
//Vector3メソッド
C3D.Vector3.prototype = {
	constructor : C3D.Vector3,
	//正規化
	normalize : function () {
		'use strict';
		var norm = this.norm();
		this.x = this.x / norm;
		this.y = this.y / norm;
		this.z = this.z / norm;
		return this;
	},
	//thisを原点とする方向ベクトル
	directionTo : function (v) {
		'use strict';
		return new C3D.Vector3(v.x - this.x, v.y - this.y, v.z - this.z);
	},
	//絶対値
	norm : function () {
		'use strict';
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
	}
	
};
//Vector3クラスメソッド　内積
C3D.Vector3.InnerProduct = function (v1, v2) {
	'use strict';
	return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};
//Vector3クラスメソッド　外積
C3D.Vector3.ExteriorProduct = function (v1, v2) {
	'use strict';
	return new C3D.Vector3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
};
//Vector2コンストラクタ
C3D.Vector2 = function (x, y) {
	'use strict';
	this.x = x;
	this.y = y;
};
//Vector2メソッド
C3D.Vector2.prototype = {};
