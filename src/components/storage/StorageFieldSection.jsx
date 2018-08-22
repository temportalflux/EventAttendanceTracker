import React from 'react';
import PropTypes from 'prop-types';
import {Header, Segment} from "semantic-ui-react";
import {StorageFieldBuilder} from "./StorageFieldBuilder";
import * as shortid from "shortid";
import StorageFieldSectionData from "./StorageFieldSectionData";

export class StorageFieldSection extends React.Component {

    render() {
        let { title, sectionData, segment, sectionDepth } = this.props;
        if (sectionDepth <= 0) {
            return (
                <div>
                    {title && <Header>{title}</Header>}
                    <Segment {...segment}>
                        {sectionData.props.fields.map((storageFieldData) => (
                            <StorageFieldBuilder
                                key={shortid.generate()}
                                storageFieldData={storageFieldData}
                            />
                        ))}
                    </Segment>
                </div>
            );
        }
        else {
            return (
                <div>
                    {sectionData.map((section) => (
                        <StorageFieldSection
                            key={shortid.generate()}
                            sectionData={section}
                            sectionDepth={sectionDepth - 1}
                        />
                    ))}
                </div>
            );
        }
    }

}

StorageFieldSection.defaultProps = {
    title: undefined,
    segment: {},
    sectionDepth: 0,
    validateEventKey: undefined,

};

StorageFieldSection.propTypes = {
    sectionData: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.instanceOf(StorageFieldSectionData)),
        PropTypes.instanceOf(StorageFieldSectionData)
    ]).isRequired,

    title: PropTypes.string,
    segment: PropTypes.shape(Segment.propTypes),
    sectionDepth: PropTypes.number,

    validateEventKey: PropTypes.string,

};