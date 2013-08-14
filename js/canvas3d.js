var window = window || {};
(function (window) {
	'use strict';
	/**********
		C3D
	**********/
	//コンストラクタ
	var C3D = function () {
	};
	//C3Dメソッド
	C3D.prototype = {};
	/*******************
		C3D.Geometry
	*******************/
	//コンストラクタ
	C3D.Geometry = function () {
		//Publicプロパティ
		this.position = new C3D.Vector3();
		this.vertices = [];		//C3D.Vector3の配列
		this.lines = [];		//C3D.Lineの配列
		this.faces = [];		//C3D.Faceの配列
		this.postureMatrix = new C3D.Matrix4();
	};
	//メソッド
	C3D.Geometry.prototype = {
		//vertexの追加
		addVertex : function (vector3) {
			return this.vertices.push(vector3);
		},
		//lineの追加
		addLine : function (vertices) {
			var l = new C3D.Geometry.Line(vertices);
			return this.Lines.push(l);
		},
		//Faceの追加
		addFace : function (vertices) {
			var f = new C3D.Geometry.Face(vertices);
			return this.faces.push(f);
		},
		//x軸回転
		rotateX : function (value) {
			return this.postureMatrix.rotateX(value);
		},
		//y軸回転
		rotateY : function (value) {
			return this.postureMatrix.rotateY(value);
		},
		//z軸回転
		rotateZ : function (value) {
			return this.postureMatrix.rotateZ(value);
		},
		//移動
		transrate : function (x, y, z) {
			return this.postureMatrix.rotate(x, y, z);
		},
		//x軸移動
		transrateX : function (value) {
			return this.postureMatrix.transrateX(value);
		},
		//y軸移動
		transrateY : function (value) {
			
			return this.postureMatrix.transrateY(value);
		},
		//z軸移動
		transrateZ : function (value) {
			return this.postureMatrix.transrateZ(value);
		},
		//x軸拡大
		scaleX : function (value) {
			return this.postureMatrix.scaleX(value);
		},
		//y軸拡大
		scaleY : function (value) {
			return this.postureMatrix.scaleY(value);
		},
		//z軸拡大
		scaleZ : function (value) {
			return this.postureMatrix.scaleZ(value);
		},
		//クォータニオン
		quaternion : function (vector, radian) {
			return this.postureMatrix.quaternion(vector, radian);
		}
	};
	/************************
		C3D.Geometry.Line
	************************/
	//コンストラクタ
	C3D.Geometry.Line = function (vertices) {
		//プロパティ
		this.vertices = vertices;
		this.initCentroid();
	};
	//メソッド
	C3D.Geometry.Line.prototype = {
		//centroidの初期化
		initCentroid : function () {
			var x = (this.vertices[0].x + this.vertices[1].x) / 2,
				y = (this.vertices[0].y + this.vertices[1].y) / 2,
				z = (this.vertices[0].z + this.vertices[1].z) / 2;
			this.centroid = new C3D.Vector3(x, y, z);
			return this.centroid;
		}
	};
	/************************
		C3D.Geometry.Face
	************************/
	//コンストラクタ
	C3D.Geometry.Face = function (vertices) {
		//プロパティ
		this.vertices = vertices;
		this.color = "#888888";
		this.initCentroid();
		this.initNormal();
	};
	//メソッド
	C3D.Geometry.Face.prototype = {
		initCentroid : function () {
			var x = 0,
				y = 0,
				z = 0,
				i,
				vertex;
			for (i = 0; i < this.vertices.length; i = i + 1) {
				vertex = this.vertices[i];
				x += vertex.x;
				y += vertex.y;
				z += vertex.z;
			}
			x /= this.vertices.length;
			y /= this.vertices.length;
			z /= this.vertices.length;
			this.centroid = new C3D.Vector3(x, y, z);
			return this.centroid;
		},
		initNormal : function () {
			var o = this.vertices[0],
				a = this.vertices[1],
				b = this.vertices[this.vertices.length - 1],
				v1 = o.directionTo(a),
				v2 = o.directionTo(b);
			this.normal = C3D.Vector3.ExteriorProduct(v1, v2).normalize();
			return this.normal;
		}
	};
	/****************
		C3D.Scene
	****************/
	//オブジェクト
	C3D.Scene = function () {
		this.geometries = [];
	};
	//メソッド
	C3D.Scene.prototype = {
		add : function (geometry) {
			return this.geometries.push(geometry);
		}
	};
	/*****************
		C3D.Camera
	*****************/
	//コンストラクタ
	C3D.Camera = function (angle, aspect, position, lookAt, upperPoint) {
		this.angle = angle || 0;
		this.aspect = aspect || 0;
		this.position = position || new C3D.Vector3(0, 0, 100);
		this.lookAt = lookAt || new C3D.Vector3();
		this.upperPoint = upperPoint || new C3D.Vector3(0, 100, 0);
		this.initVector();
	};
	//メソッド
	C3D.Camera.prototype = {
		setAngle : function (angle) {
			this.angle = angle;
			return this;
		},
		setAspect : function (aspect) {
			this.aspect = aspect;
			return this;
		},
		setPosition : function (position) {
			this.position = position;
			return this;
		},
		setLookAt : function (pos) {
			this.lookAt = pos;
			return this;
		},
		setUpperPoint : function (pos) {
			this.upperPoint = pos;
			return this;
		},
		initVector : function () {
			this.direction = this.position.directionTo(this.lookAt).normalize();
			this.right = C3D.Vector3.ExteriorProduct(this.direction, this.position.directionTo(this.upperPoint)).normalize();
			this.up = C3D.Vector3.ExteriorProduct(this.right, this.direction).normalize();
			return this;
		}
	};
	/*******************
		C3D.Renderer
	*******************/
	//コンストラクタ
	C3D.Renderer = function () {
		//Publicプロパティ
		this.canvas = window.document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
	};
	//メソッド
	C3D.Renderer.prototype = {
		//Sizeプロパティの設定
		setSize : function (width, height) {
			this.canvas.style.width = width;
			this.canvas.style.height = height;
			this.canvas.width = width;
			this.canvas.height = height;
			this.width = width;
			this.height = height;
			return this;
		},
		//sceneの描画
		render : function (scene, camera) {
			var g,
				m,
				faces = [],
				vertices,
				v,
				x,
				y;
			this.context.clearRect(0, 0, this.width, this.height);
			this.context.beginPath();
			this.context.lineWidth = 1;
			this.context.strokeStyle = "#000000";
			g = scene.geometries[0];
			m = new C3D.Matrix4(g.postureMatrix.matrix);
			//ワールド座標変換
			m.transrate(g.position.x, g.position.y, g.position.z);
			//ビュー座標変換
			m.transrate(-camera.position.x, -camera.position.y, -camera.position.z);
			m.tramsformCoordinate(camera.right, camera.direction, camera.up);
			
			faces = g.faces;
			vertices = faces[0].vertices;
			
			//ビュー座標
			v = vertices[0].expandIntoVector4().productWithMatrix(m);
			//スクリーン座標変換
			x = ((this.width / 2) * (v.x / v.y)) / Math.tan(camera.angle / 2) + (this.width / 2);
			y = -((this.height / 2) * (v.z / v.y) * camera.aspect) / Math.tan(camera.angle / 2) + (this.height / 2);
			this.context.moveTo(x, y);
			
			//ビュー座標
			v = vertices[1].expandIntoVector4().productWithMatrix(m);
			//スクリーン座標変換
			x = ((this.width / 2) * (v.x / v.y)) / Math.tan(camera.angle / 2) + (this.width / 2);
			y = -((this.height / 2) * (v.z / v.y) * camera.aspect) / Math.tan(camera.angle / 2) + (this.height / 2);
			this.context.lineTo(x, y);
			
			//ビュー座標
			v = vertices[2].expandIntoVector4().productWithMatrix(m);
			//スクリーン座標変換
			x = ((this.width / 2) * (v.x / v.y)) / Math.tan(camera.angle / 2) + (this.width / 2);
			y = -((this.height / 2) * (v.z / v.y) * camera.aspect) / Math.tan(camera.angle / 2) + (this.height / 2);
			this.context.lineTo(x, y);
			
			//ビュー座標
			v = vertices[3].expandIntoVector4().productWithMatrix(m);
			//スクリーン座標変換
			x = ((this.width / 2) * (v.x / v.y)) / Math.tan(camera.angle / 2) + (this.width / 2);
			y = -((this.height / 2) * (v.z / v.y) * camera.aspect) / Math.tan(camera.angle / 2) + (this.height / 2);
			this.context.lineTo(x, y);
			
			this.context.closePath();
			this.context.fill();
			return this;
		},
		//線の描画
		line : function (v1, v2) {
			this.context.beginPath();
			this.context.moveTo(v1.x, v1.y);
			this.context.lineTo(v2.x, v2.y);
			this.context.stroke();
			return this;
		},
		//点の描画
		dot : function (v) {
			this.context.beginPath();
			this.context.arc(v.x, v.y, 1, 0, Math.PI * 2, false);
			this.context.fill();
			return this;
		}
	};
	/*****************
		C3D.Vector4
	*****************/
	//コンストラクタ
	C3D.Vector4 = function (x, y, z, w) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = (w !== undefined) ? w : 1;
	};
	//メソッド
	C3D.Vector4.prototype = {
		productWithMatrix : function (matrix4) {
			var x,
				y,
				z,
				w;
			x = matrix4.matrix[0][0] * this.x + matrix4.matrix[0][1] * this.y + matrix4.matrix[0][2] * this.z + matrix4.matrix[0][3] * this.w;
			y = matrix4.matrix[1][0] * this.x + matrix4.matrix[1][1] * this.y + matrix4.matrix[1][2] * this.z + matrix4.matrix[1][3] * this.w;
			z = matrix4.matrix[2][0] * this.x + matrix4.matrix[2][1] * this.y + matrix4.matrix[2][2] * this.z + matrix4.matrix[2][3] * this.w;
			w = matrix4.matrix[3][0] * this.x + matrix4.matrix[3][1] * this.y + matrix4.matrix[3][2] * this.z + matrix4.matrix[3][3] * this.w;
			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;
			return this;
		},
		//toString
		toString : function () {
			return "(" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + ")";
		}
	};
	/*****************
		C3D.Vector3
	*****************/
	//コンストラクタ
	C3D.Vector3 = function (x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	};
	//メソッド
	C3D.Vector3.prototype = {
		constructor : C3D.Vector3,
		//正規化
		normalize : function () {
			var norm = this.norm();
			this.x = this.x / norm;
			this.y = this.y / norm;
			this.z = this.z / norm;
			return this;
		},
		//thisを原点とする方向ベクトル
		directionTo : function (v) {
			return new C3D.Vector3(v.x - this.x, v.y - this.y, v.z - this.z);
		},
		//絶対値
		norm : function () {
			return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
		},
		//C3D.Vector4への拡張
		expandIntoVector4 : function () {
			return new C3D.Vector4(this.x, this.y, this.z, 1);
		}
	};
	//クラスメソッド　内積
	C3D.Vector3.InnerProduct = function (v1, v2) {
		return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
	};
	//クラスメソッド　外積
	C3D.Vector3.ExteriorProduct = function (v1, v2) {
		return new C3D.Vector3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
	};
	/******************
		C3D.Vector2
	******************/
	//コンストラクタ
	C3D.Vector2 = function (x, y) {
		this.x = x;
		this.y = y;
	};
	//メソッド
	C3D.Vector2.prototype = {};
	/******************
		C3D.Matrix4
	******************/
	//コンストラクタ
	C3D.Matrix4 = function (matrix) {
		this.matrix = matrix || C3D.Matrix4.IdentityMatrix();
	};
	//メソッド
	C3D.Matrix4.prototype = {
		//初期化
		initMatrix : function () {
			this.matrix = C3D.Matrix4.IdentityMatrix();
			return this;
		},
		//x軸回転
		rotateX : function (value) {
			var sin = Math.sin(value),
				cos = Math.cos(value),
				m = new C3D.Matrix4([[1, 0, 0, 0], [0, cos, -sin, 0], [0, sin, cos, 0], [0, 0, 0, 1]]);
			this.productWith(m);
			return this;
		},
		//y軸回転
		rotateY : function (value) {
			var sin = Math.sin(value),
				cos = Math.cos(value),
				m = new C3D.Matrix4([[cos, 0, sin, 0], [0, 1, 0, 0], [-sin, 0, cos, 0], [0, 0, 0, 1]]);
			this.productWith(m);
			return this;
		},
		//z軸回転
		rotateZ : function (value) {
			var sin = Math.sin(value),
				cos = Math.cos(value),
				m = new C3D.Matrix4([[cos, -sin, 0, 0], [sin, cos, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
			this.productWith(m);
			return this;
		},
		//移動
		transrate : function (x, y, z) {
			var m = new C3D.Matrix4([[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]]);
			this.productWith(m);
			return this;
		},
		//x軸移動
		transrateX : function (value) {
			return this.transrate(value, 0, 0);
		},
		//y軸移動
		transrateY : function (value) {
			return this.transrate(0, value, 0);
		},
		//z軸移動
		transrateZ : function (value) {
			return this.transrate(0, 0, value);
		},
		//拡大
		scale : function (x, y, z) {
			var m = new C3D.Matrix4([[x, 0, 0, 0], [0, y, 0, 0], [0, 0, z, 0], [0, 0, 0, 1]]);
			this.productWith(m);
			return this;
		},
		//x軸拡大
		scaleX : function (value) {
			return this.scale(value, 1, 1);
		},
		//y軸拡大
		scaleY : function (value) {
			return this.scale(1, value, 1);
		},
		//z軸拡大
		scaleZ : function (value) {
			return this.scale(1, 1, value);
		},
		//クォータニオン
		quaternion : function (vector, radian) {
			var sin = Math.sin(radian),
				q0 = vector.x * sin,
				q1 = vector.y * sin,
				q2 = vector.z * sin,
				q3 = Math.cos(radian),
				q0_q0 = q0 * q0,
				q0_q1 = q0 * q1,
				q0_q2 = q0 * q2,
				q0_q3 = q0 * q3,
				q1_q1 = q1 * q1,
				q1_q2 = q1 * q2,
				q1_q3 = q1 * q3,
				q2_q2 = q2 * q2,
				q2_q3 = q2 * q3,
				q3_q3 = q3 * q3,
				m = new C3D.Matrix4([[q0_q0 - q1_q1 - q2_q2 + q3_q3, 2 * (q0_q1 - q2_q3), 2 * (q0_q2 + q1_q3), 0], [2 * (q0_q1 + q2_q3), -q0_q0 + q1_q1 - q2_q2 + q3_q3, 2 * (q1_q2 - q0_q3), 0], [2 * (q0_q2 - q1_q3), 2 * (q0_q3 + q1_q2), -q0_q0 - q1_q1 + q2_q2 + q3_q3, 0], [0, 0, 0, 1]]);
			this.productWith(m);
			return this;
		},
		//座標変換
		tramsformCoordinate : function (vectorX, vectorY, vectorZ) {
			var m = new C3D.Matrix4([[vectorX.x, vectorY.x, vectorZ.x, 0], [vectorX.y, vectorY.y, vectorZ.y, 0], [vectorX.z, vectorY.z, vectorZ.z, 0], [0, 0, 0, 1]]);
			this.productWith(m.inverse());
			return this;
		},
		//小行列を返す
		submatrix : function (row, column) {
			var m = new C3D.Matrix3(),
				i,
				j,
				k,
				l;
			for (i = 0, k = 0; i < 3; i = i + 1, k = k + 1) {
				if (i === row) {
					k += 1;
				}
				for (j = 0, l = 0; j < 3; j = j + 1, l = l + 1) {
					if (j === column) {
						l += 1;
					}
					m.matrix[i][j] = this.matrix[k][l];
				}
			}
			return m;
		},
		//行列式を返す
		determinant : function () {
			var det = 0,
				i;
			for (i = 0; i < 4; i = i + 1) {
				det += Math.pow(-1, i) * this.matrix[i][0] * this.submatrix(i, 0).determinant();
			}
			return det;
		},
		//転置
		transposition : function () {
			var m = C3D.Matrix4.IdentityMatrix(),
				i,
				j;
			for (i = 0; i < 4; i = i + 1) {
				for (j = 0; j < 4; j = j + 1) {
					m[i][j] = this.matrix[j][i];
				}
			}
			this.matrix = m;
			return this;
		},
		//逆行列を返す
		inverse : function () {
			var m = new C3D.Matrix4(),
				det = this.determinant(),
				i,
				j;
			for (i = 0; i < 4; i = i + 1) {
				for (j = 0; j < 4; j = j + 1) {
					m.matrix[i][j] = Math.pow(-1, i + j) * this.submatrix(i, j).determinant() / det;
				}
			}
			m.transposition();
			return m;
		},
		//行列の積
		productWith : function (matrix4) {
			var m = C3D.Matrix4.IdentityMatrix(),
				i,
				j,
				k,
				element;
			for (i = 0; i < 4; i = i + 1) {
				for (j = 0; j < 4; j = j + 1) {
					element = 0;
					for (k = 0; k < 4; k = k + 1) {
						element += matrix4.matrix[i][k] * this.matrix[k][j];
					}
					m[i][j] = element;
				}
			}
			this.matrix = m;
			return this;
		}
	};
	//クラスメソッド 単位行列を返す
	C3D.Matrix4.IdentityMatrix = function () {
		return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
	};
	/******************
		C3D.Matrix3
	******************/
	//コンストラクタ
	C3D.Matrix3 = function (matrix) {
		this.matrix = matrix || C3D.Matrix3.IdentityMatrix();
	};
	//メソッド
	C3D.Matrix3.prototype = {
		//行列式
		determinant : function () {
			var det = 0,
				m = this.matrix,
				i;
			for (i = 0; i < 3; i = i + 1) {
				det += m[i % 3][0] * m[(i + 1) % 3][1] * m[(i + 2) % 3][2];
			}
			for (i = 0; i < 3; i = i + 1) {
				det -= m[i % 3][2] * m[(i + 1) % 3][1] * m[(i + 2) % 3][0];
			}
			return det;
		}
	};
	//クラスメソッド 単位行列を返す
	C3D.Matrix3.IdentityMatrix = function () {
		return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
	};
	window.C3D = C3D;
}(window));

