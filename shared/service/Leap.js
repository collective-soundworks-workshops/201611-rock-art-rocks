'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _server = require('soundworks/server');

var _leapjs = require('leapjs');

var _leapjs2 = _interopRequireDefault(_leapjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function clip(x) {
	return Math.min(1, Math.max(x, 0));
}

var Leap = function (_Activity) {
	(0, _inherits3.default)(Leap, _Activity);

	function Leap() {
		(0, _classCallCheck3.default)(this, Leap);

		var _this = (0, _possibleConstructorReturn3.default)(this, (Leap.__proto__ || (0, _getPrototypeOf2.default)(Leap)).call(this, 'service:leap'));

		_this.listeners = [];
		_this.hand = [];
		return _this;
	}

	(0, _createClass3.default)(Leap, [{
		key: 'start',
		value: function start() {
			var _this2 = this;

			_leapjs2.default.loop({ enableGestures: true }, function (frame) {

				if (frame.hands.length > 0) {
					for (var i = 0; i < frame.hands.length; i++) {

						var hand = frame.hands[i];

						if (hand.type !== 'right') continue;

						var x = clip((hand.palmPosition[0] + 300) / 600);
						var y = clip((hand.palmPosition[2] - 300) / 600 * -1);
						var z = clip(hand.palmPosition[1] / 500);
						// const height = clip(hand.palmPosition[1] / 500);
						// const grab = clip(hand.grabStrength);
						// const pinch = clip(hand.pinchStrength);

						_this2.hand[0] = x;
						_this2.hand[1] = 1 - y;
						_this2.hand[2] = z;
						_this2.hand[3] = hand.type === 'right' ? 'r' : 'l';
						// send
						_this2.listeners.forEach(function (callback) {
							return callback(_this2.hand);
						});
					}
				} else {
					// send
					_this2.listeners.forEach(function (callback) {
						return callback(false);
					});
				}
			});
		}
	}, {
		key: 'addListener',
		value: function addListener(callback) {
			this.listeners.push(callback);
		}
	}]);
	return Leap;
}(_server.Activity);

_server.serviceManager.register('service:leap', Leap);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxlYXAuanMiXSwibmFtZXMiOlsiY2xpcCIsIngiLCJNYXRoIiwibWluIiwibWF4IiwiTGVhcCIsImxpc3RlbmVycyIsImhhbmQiLCJsb29wIiwiZW5hYmxlR2VzdHVyZXMiLCJmcmFtZSIsImhhbmRzIiwibGVuZ3RoIiwiaSIsInR5cGUiLCJwYWxtUG9zaXRpb24iLCJ5IiwieiIsImZvckVhY2giLCJjYWxsYmFjayIsInB1c2giLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7QUFFQSxTQUFTQSxJQUFULENBQWNDLENBQWQsRUFBaUI7QUFDZCxRQUFPQyxLQUFLQyxHQUFMLENBQVMsQ0FBVCxFQUFZRCxLQUFLRSxHQUFMLENBQVNILENBQVQsRUFBWSxDQUFaLENBQVosQ0FBUDtBQUNGOztJQUVLSSxJOzs7QUFDTCxpQkFBYztBQUFBOztBQUFBLGdJQUNQLGNBRE87O0FBR2IsUUFBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNBLFFBQUtDLElBQUwsR0FBWSxFQUFaO0FBSmE7QUFLYjs7OzswQkFFTztBQUFBOztBQUNQLG9CQUFLQyxJQUFMLENBQVUsRUFBQ0MsZ0JBQWdCLElBQWpCLEVBQVYsRUFBa0MsVUFBQ0MsS0FBRCxFQUFXOztBQUU1QyxRQUFJQSxNQUFNQyxLQUFOLENBQVlDLE1BQVosR0FBcUIsQ0FBekIsRUFBNEI7QUFDM0IsVUFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILE1BQU1DLEtBQU4sQ0FBWUMsTUFBaEMsRUFBd0NDLEdBQXhDLEVBQTZDOztBQUU1QyxVQUFNTixPQUFPRyxNQUFNQyxLQUFOLENBQVlFLENBQVosQ0FBYjs7QUFFQSxVQUFJTixLQUFLTyxJQUFMLEtBQWMsT0FBbEIsRUFBMkI7O0FBRTNCLFVBQU1iLElBQUlELEtBQUssQ0FBQ08sS0FBS1EsWUFBTCxDQUFrQixDQUFsQixJQUF1QixHQUF4QixJQUErQixHQUFwQyxDQUFWO0FBQ0EsVUFBTUMsSUFBSWhCLEtBQUssQ0FBQ08sS0FBS1EsWUFBTCxDQUFrQixDQUFsQixJQUF1QixHQUF4QixJQUErQixHQUEvQixHQUFxQyxDQUFDLENBQTNDLENBQVY7QUFDQSxVQUFNRSxJQUFJakIsS0FBS08sS0FBS1EsWUFBTCxDQUFrQixDQUFsQixJQUF1QixHQUE1QixDQUFWO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQUtSLElBQUwsQ0FBVSxDQUFWLElBQWVOLENBQWY7QUFDQSxhQUFLTSxJQUFMLENBQVUsQ0FBVixJQUFlLElBQUlTLENBQW5CO0FBQ0EsYUFBS1QsSUFBTCxDQUFVLENBQVYsSUFBZVUsQ0FBZjtBQUNBLGFBQUtWLElBQUwsQ0FBVSxDQUFWLElBQWdCQSxLQUFLTyxJQUFMLEtBQWMsT0FBZixHQUEwQixHQUExQixHQUFnQyxHQUEvQztBQUNBO0FBQ0EsYUFBS1IsU0FBTCxDQUFlWSxPQUFmLENBQXVCLFVBQUNDLFFBQUQ7QUFBQSxjQUFjQSxTQUFTLE9BQUtaLElBQWQsQ0FBZDtBQUFBLE9BQXZCO0FBQ0E7QUFDRCxLQXJCRCxNQXFCTztBQUNOO0FBQ0MsWUFBS0QsU0FBTCxDQUFlWSxPQUFmLENBQXVCLFVBQUNDLFFBQUQ7QUFBQSxhQUFjQSxTQUFTLEtBQVQsQ0FBZDtBQUFBLE1BQXZCO0FBQ0Q7QUFDRCxJQTNCRDtBQTRCQTs7OzhCQUVXQSxRLEVBQVU7QUFDckIsUUFBS2IsU0FBTCxDQUFlYyxJQUFmLENBQW9CRCxRQUFwQjtBQUNBOzs7OztBQUdGLHVCQUFlRSxRQUFmLENBQXdCLGNBQXhCLEVBQXdDaEIsSUFBeEMiLCJmaWxlIjoiTGVhcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGl2aXR5LCBzZXJ2aWNlTWFuYWdlciB9IGZyb20gJ3NvdW5kd29ya3Mvc2VydmVyJztcbmltcG9ydCBsZWFwIGZyb20gJ2xlYXBqcyc7XG5cbmZ1bmN0aW9uIGNsaXAoeCkge1xuICAgcmV0dXJuIE1hdGgubWluKDEsIE1hdGgubWF4KHgsIDApKTtcbn1cblxuY2xhc3MgTGVhcCBleHRlbmRzIEFjdGl2aXR5IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoJ3NlcnZpY2U6bGVhcCcpO1xuXG5cdFx0dGhpcy5saXN0ZW5lcnMgPSBbXTtcblx0XHR0aGlzLmhhbmQgPSBbXTtcblx0fVxuXG5cdHN0YXJ0KCkge1xuXHRcdGxlYXAubG9vcCh7ZW5hYmxlR2VzdHVyZXM6IHRydWV9LCAoZnJhbWUpID0+IHtcblxuXHRcdFx0aWYgKGZyYW1lLmhhbmRzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZS5oYW5kcy5sZW5ndGg7IGkrKykge1xuXG5cdFx0XHRcdFx0Y29uc3QgaGFuZCA9IGZyYW1lLmhhbmRzW2ldO1xuXG5cdFx0XHRcdFx0aWYgKGhhbmQudHlwZSAhPT0gJ3JpZ2h0JykgY29udGludWU7XG5cblx0XHRcdFx0XHRjb25zdCB4ID0gY2xpcCgoaGFuZC5wYWxtUG9zaXRpb25bMF0gKyAzMDApIC8gNjAwKTtcblx0XHRcdFx0XHRjb25zdCB5ID0gY2xpcCgoaGFuZC5wYWxtUG9zaXRpb25bMl0gLSAzMDApIC8gNjAwICogLTEpO1xuXHRcdFx0XHRcdGNvbnN0IHogPSBjbGlwKGhhbmQucGFsbVBvc2l0aW9uWzFdIC8gNTAwKTtcblx0XHRcdFx0XHQvLyBjb25zdCBoZWlnaHQgPSBjbGlwKGhhbmQucGFsbVBvc2l0aW9uWzFdIC8gNTAwKTtcblx0XHRcdFx0XHQvLyBjb25zdCBncmFiID0gY2xpcChoYW5kLmdyYWJTdHJlbmd0aCk7XG5cdFx0XHRcdFx0Ly8gY29uc3QgcGluY2ggPSBjbGlwKGhhbmQucGluY2hTdHJlbmd0aCk7XG5cblx0XHRcdFx0XHR0aGlzLmhhbmRbMF0gPSB4O1xuXHRcdFx0XHRcdHRoaXMuaGFuZFsxXSA9IDEgLSB5O1xuXHRcdFx0XHRcdHRoaXMuaGFuZFsyXSA9IHo7XG5cdFx0XHRcdFx0dGhpcy5oYW5kWzNdID0gKGhhbmQudHlwZSA9PT0gJ3JpZ2h0JykgPyAncicgOiAnbCc7XG5cdFx0XHRcdFx0Ly8gc2VuZFxuXHRcdFx0XHRcdHRoaXMubGlzdGVuZXJzLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjayh0aGlzLmhhbmQpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gc2VuZFxuXHRcdFx0XHRcdHRoaXMubGlzdGVuZXJzLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjayhmYWxzZSkpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0YWRkTGlzdGVuZXIoY2FsbGJhY2spIHtcblx0XHR0aGlzLmxpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcblx0fVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3Rlcignc2VydmljZTpsZWFwJywgTGVhcCk7XG4iXX0=