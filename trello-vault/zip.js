'use strict';

(function () {
  const encoder = new TextEncoder();
  const CRC_TABLE = (function () {
    const table = new Uint32Array(256);
    for (let n=0;n<256;n++) {
      let c=n;
      for (let k=0;k<8;k++) c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);
      table[n]=c>>>0;
    }
    return table;
  })();

  function crc32(bytes) {
    let c=0xFFFFFFFF;
    for (let i=0;i<bytes.length;i++) c=CRC_TABLE[(c^bytes[i])&0xFF]^(c>>>8);
    return (c^0xFFFFFFFF)>>>0;
  }

  function dosDateTime(date) {
    const d=date instanceof Date ? date : new Date(date || Date.now());
    const year=Math.max(1980,d.getFullYear());
    const time=((d.getHours()&31)<<11)|((d.getMinutes()&63)<<5)|((Math.floor(d.getSeconds()/2))&31);
    const day=((year-1980)<<9)|(((d.getMonth()+1)&15)<<5)|(d.getDate()&31);
    return {time:time,date:day};
  }

  function dataView(size) {
    const bytes=new Uint8Array(size);
    return {bytes:bytes,view:new DataView(bytes.buffer)};
  }

  class ZipWriter {
    constructor() {
      this.parts=[];
      this.entries=[];
      this.offset=0;
      this.closed=false;
    }

    async add(path,data,modified) {
      if (this.closed) throw new Error('ZIP is already finalized.');
      const clean=String(path||'file').replace(/\\/g,'/').replace(/^\/+/,'');
      const name=encoder.encode(clean);
      const blob=data instanceof Blob ? data : new Blob([data]);
      if (blob.size>0xFFFFFFFF) throw new Error('A single file is too large for this ZIP format (>4 GB).');
      if (this.offset>0xFFFFFFFF) throw new Error('Backup is too large for this browser ZIP format (>4 GB).');

      const buffer=await blob.arrayBuffer();
      const bytes=new Uint8Array(buffer);
      const crc=crc32(bytes);
      const size=bytes.byteLength;
      const dt=dosDateTime(modified);

      const local=dataView(30+name.length);
      const v=local.view;
      v.setUint32(0,0x04034b50,true);
      v.setUint16(4,20,true);
      v.setUint16(6,0x0800,true);
      v.setUint16(8,0,true);
      v.setUint16(10,dt.time,true);
      v.setUint16(12,dt.date,true);
      v.setUint32(14,crc,true);
      v.setUint32(18,size,true);
      v.setUint32(22,size,true);
      v.setUint16(26,name.length,true);
      v.setUint16(28,0,true);
      local.bytes.set(name,30);

      const entry={
        name:name,crc:crc,size:size,time:dt.time,date:dt.date,offset:this.offset
      };
      this.entries.push(entry);
      this.parts.push(local.bytes,blob);
      this.offset+=local.bytes.byteLength+size;
    }

    async addText(path,text,modified) {
      return this.add(path,new Blob([String(text)],{type:'text/plain;charset=utf-8'}),modified);
    }

    async addJson(path,value,modified) {
      return this.add(path,new Blob([JSON.stringify(value==null?null:value,null,2)],{type:'application/json'}),modified);
    }

    finalize() {
      if (this.closed) throw new Error('ZIP is already finalized.');
      if (this.entries.length>0xFFFF) throw new Error('Too many files for this ZIP format.');
      const central=[];
      let centralSize=0;

      for (const e of this.entries) {
        const h=dataView(46+e.name.length);
        const v=h.view;
        v.setUint32(0,0x02014b50,true);
        v.setUint16(4,20,true);
        v.setUint16(6,20,true);
        v.setUint16(8,0x0800,true);
        v.setUint16(10,0,true);
        v.setUint16(12,e.time,true);
        v.setUint16(14,e.date,true);
        v.setUint32(16,e.crc,true);
        v.setUint32(20,e.size,true);
        v.setUint32(24,e.size,true);
        v.setUint16(28,e.name.length,true);
        v.setUint16(30,0,true);
        v.setUint16(32,0,true);
        v.setUint16(34,0,true);
        v.setUint16(36,0,true);
        v.setUint32(38,0,true);
        v.setUint32(42,e.offset,true);
        h.bytes.set(e.name,46);
        central.push(h.bytes);
        centralSize+=h.bytes.byteLength;
      }

      const end=dataView(22);
      end.view.setUint32(0,0x06054b50,true);
      end.view.setUint16(4,0,true);
      end.view.setUint16(6,0,true);
      end.view.setUint16(8,this.entries.length,true);
      end.view.setUint16(10,this.entries.length,true);
      end.view.setUint32(12,centralSize,true);
      end.view.setUint32(16,this.offset,true);
      end.view.setUint16(20,0,true);

      this.closed=true;
      return new Blob(this.parts.concat(central,[end.bytes]),{type:'application/zip'});
    }
  }

  window.TrelloVaultZip={ZipWriter:ZipWriter};
})();
