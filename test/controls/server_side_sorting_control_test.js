
var test = require('tap').test;

var asn1 = require('asn1');

var BerReader = asn1.BerReader;
var BerWriter = asn1.BerWriter;
var getControl;
var ServerSideSortingControl;

function bufferEqual(t, a, b) {
  t.equal(a.toString('hex'), b.toString('hex'));
}


///--- Tests


test('load library', function (t) {
  ServerSideSortingControl =
    require('../../lib').ServerSideSortingControl;
  t.ok(ServerSideSortingControl);
  getControl = require('../../lib').getControl;
  t.ok(getControl);
  t.end();
});


test('new no args', function (t) {
  t.ok(new ServerSideSortingControl());
  t.end();
});


test('new with args', function (t) {
  var c = new ServerSideSortingControl({
    type: '1.2.840.113556.1.4.473',
    criticality: true,
    value: {
      attributeType: 'sn'
    }
  });
  t.ok(c);
  t.equal(c.type, '1.2.840.113556.1.4.473');
  t.ok(c.criticality);
  t.equal(c.value.attributeType, 'sn');

  var writer = new BerWriter();
  c.toBer(writer);
  var reader = new BerReader(writer.buffer);
  var sssc = getControl(reader);
  t.ok(sssc);
  console.log('sssc', sssc.value);
  t.equal(sssc.type, '1.2.840.113556.1.4.473');
  t.ok(sssc.criticality);
  t.equal(sssc.value.attributeType, 'sn');
  bufferEqual(t, sssc.value.cookie, new Buffer(['sn']));

  t.end();
});

test('tober', function (t) {
  var sssc = new ServerSideSortingControl({
    type: '1.2.840.113556.1.4.473',
    criticality: true,
    value: {
      attributeType: 'sn'
    }
  });

  var ber = new BerWriter();
  sssc.toBer(ber);

  var c = getControl(new BerReader(ber.buffer));
  t.ok(c);
  t.equal(c.type, '1.2.840.113556.1.4.473');
  t.ok(c.criticality);
  t.equal(c.value.attributeType, 'sn');
  bufferEqual(t, c.value.cookie, new Buffer(0));

  t.end();
});
