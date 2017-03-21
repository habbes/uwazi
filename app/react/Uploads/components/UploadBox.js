import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dropzone from 'react-dropzone';
import ShowIf from 'app/App/ShowIf';
import Loader from 'app/components/Elements/Loader';

import {uploadDocument, unselectAllDocuments, selectDocument, createDocuments} from 'app/Uploads/actions/uploadsActions';

export class UploadBox extends Component {

  constructor(props) {
    super(props);
    this.state = {totalFiles: 0};
  }

  onDrop(files) {
    this.props.unselectAllDocuments();
    this.props.createDocuments(files)
    .then(() => {
      this.setState({totalFiles: this.state.totalFiles - files.length});
    });
    this.setState({totalFiles: files.length + this.state.totalFiles});
  }

  render() {
    const uploadedFiles = this.state.totalFiles - this.props.uploadingFiles.size;
    const totalFiles = this.state.totalFiles;
    const percentageUploaded = Math.floor(this.props.uploadingFiles.toList().reduce((total, percentage) => total + percentage, 0) / this.props.uploadingFiles.size);
    return (
      <div>
        <Dropzone style={{}} onDrop={this.onDrop.bind(this)} accept="application/pdf">
          <div className="upload-box">
            <div className="upload-box_wrapper">
              <i className="upload-box_icon fa fa-upload"></i>
              <p className="upload-box_title">
                <span>Drag and drop your files</span>
              </p>
              <a className="upload-box_link">
                <span className="upload-box_or">or</span>
                <b className="upload-box_cta">Click here for browsing your local files</b>
              </a>
              <span className="upload-box_formats">Supported formats: PDF</span>
            </div>
          </div>
        </Dropzone>
        <div className="upload-progress-bar-container">
          <ShowIf if={!!totalFiles && !this.props.uploadingFiles.size}>
            <div>
              <span>Initialising upload</span>
              <Loader/>
            </div>
          </ShowIf>
          <ShowIf if={!!totalFiles && !!this.props.uploadingFiles.size}>
            <div>
              <span>{uploadedFiles} / {totalFiles}</span>
              <div className="progress">
                <div className="progress-bar progress-bar-warning progress-bar-striped" role="progressbar" style={{width: percentageUploaded + '%'}}>
                </div>
              </div>
            </div>
          </ShowIf>
        </div>
      </div>
    );
  }
}

UploadBox.propTypes = {
  uploadingFiles: PropTypes.object,
  uploadDocument: PropTypes.func,
  createDocuments: PropTypes.func,
  unselectAllDocuments: PropTypes.func,
  selectDocument: PropTypes.func
};


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    uploadDocument,
    unselectAllDocuments,
    selectDocument,
    createDocuments
  }, dispatch);
}

const mapStateToProps = ({uploads}) => {
  return {
    uploadingFiles: uploads.progress
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadBox);
