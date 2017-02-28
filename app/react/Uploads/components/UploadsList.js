import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {RowList} from 'app/Layout/Lists';
import Dropzone from 'react-dropzone';
import UploadDoc from 'app/Uploads/components/UploadDoc';
import UploadEntity from 'app/Uploads/components/UploadEntity';
import {conversionComplete, updateDocument, createDocument, finishEdit} from 'app/Uploads/actions/uploadsActions';


export class UploadsList extends Component {

  onDrop(files) {
    files.forEach((file) => {
      let doc = {title: this.extractTitle(file)};
      this.props.createDocument(doc)
      .then((newDoc) => {
        this.props.uploadDocument(newDoc.sharedId, file);
      });
    });
    this.props.finishEdit();
  }

  extractTitle(file) {
    let title = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/ {2}/g, ' ');

    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  componentWillMount() {
    this.props.socket.on('documentProcessed', (docId) => {
      this.props.conversionComplete(docId);
    });

    this.props.socket.on('conversionFailed', (docId) => {
      this.props.updateDocument({_id: docId, processed: false});
    });
  }

  render() {
    const documents = this.props.documents.sort((a, b) => b.get('creationDate') - a.get('creationDate'));

    return (
      <Dropzone style={{}} onDrop={this.onDrop.bind(this)} accept="application/pdf">
        <RowList>
          <div className="item upload-box">
            <p><i className="fa fa-upload"></i> Drag and drop your files here for uploading</p>
            <span className="upload-box_formats">Supported formats: PDF</span>
          </div>
          {documents.map(doc => {
            if (doc.get('type') === 'document') {
              return <UploadDoc doc={doc} key={doc.get('_id')}/>;
            }

            return <UploadEntity entity={doc} key={doc.get('_id')}/>;
          })}
        </RowList>
      </Dropzone>
    );
  }
}

UploadsList.propTypes = {
  documents: PropTypes.object,
  progress: PropTypes.object,
  socket: PropTypes.object,
  conversionComplete: PropTypes.func,
  updateDocument: PropTypes.func,
  uploadDocument: PropTypes.func,
  createDocument: PropTypes.func,
  finishEdit: PropTypes.func
};

export function mapStateToProps(state) {
  return {
    documents: state.uploads.documents
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({conversionComplete, updateDocument, finishEdit, createDocument}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadsList);
